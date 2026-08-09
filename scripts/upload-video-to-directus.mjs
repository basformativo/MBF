// Sube videos grandes a Directus evitando el timeout del servidor en subidas largas.
// Metodo: sube el archivo directo a R2 (multipart, por partes) y despues le pide a
// Directus que lo importe desde ahi (server-to-server, rapido). Igual a como se
// resolvio manualmente la subida del video de Chus Mateo.
//
// Uso:
//   node scripts/upload-video-to-directus.mjs <ruta-al-video> <titulo> [folder-id] [filename-download]
//
// Ejemplo:
//   node scripts/upload-video-to-directus.mjs "C:/videos/charla.mp4" "Fulano - Tema de la charla" 62bfd00b-740d-4277-86a7-c6f2a6acdd5e fulano-tema.mp4
//
// Al terminar imprime el ID del archivo creado en Directus (directus_files.id).
// Ese ID es el que va en el campo "Video" de la clase correspondiente.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const DIRECTUS_BASE = env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = env.DIRECTUS_ADMIN_TOKEN;
const R2_BUCKET = env.R2_BUCKET_NAME;

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const [, , FILE_PATH, TITLE, FOLDER, FILENAME_DOWNLOAD_ARG] = process.argv;

if (!FILE_PATH || !TITLE) {
  console.error('Uso: node scripts/upload-video-to-directus.mjs <ruta-al-video> <titulo> [folder-id] [filename-download]');
  process.exit(1);
}

const FILENAME_DOWNLOAD = FILENAME_DOWNLOAD_ARG || path.basename(FILE_PATH);
const STAGING_KEY = `staging/${Date.now()}-${FILENAME_DOWNLOAD}`;
const PART_SIZE = 25 * 1024 * 1024; // 25MB por parte

async function uploadMultipart() {
  const size = fs.statSync(FILE_PATH).size;
  console.log(`[R2] Subiendo ${FILE_PATH} (${size} bytes) -> ${R2_BUCKET}/${STAGING_KEY}`);

  const create = await r2.send(new CreateMultipartUploadCommand({
    Bucket: R2_BUCKET,
    Key: STAGING_KEY,
    ContentType: 'video/mp4',
  }));
  const uploadId = create.UploadId;

  const parts = [];
  const fd = fs.openSync(FILE_PATH, 'r');
  let offset = 0;
  let partNumber = 1;
  const buf = Buffer.alloc(PART_SIZE);
  const startTime = Date.now();

  try {
    while (offset < size) {
      const toRead = Math.min(PART_SIZE, size - offset);
      const bytesRead = fs.readSync(fd, buf, 0, toRead, offset);
      const body = Buffer.from(buf.subarray(0, bytesRead));

      let attempt = 0;
      let done = false;
      let etag;
      while (!done && attempt < 5) {
        attempt++;
        try {
          const res = await r2.send(new UploadPartCommand({
            Bucket: R2_BUCKET,
            Key: STAGING_KEY,
            UploadId: uploadId,
            PartNumber: partNumber,
            Body: body,
          }));
          etag = res.ETag;
          done = true;
        } catch (e) {
          console.log(`[R2] Parte ${partNumber} intento ${attempt} fallo: ${e.message}`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
      if (!done) throw new Error(`No se pudo subir la parte ${partNumber}`);

      parts.push({ ETag: etag, PartNumber: partNumber });
      offset += bytesRead;
      partNumber++;

      const pct = ((offset / size) * 100).toFixed(1);
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = (offset / 1024 / 1024 / elapsed).toFixed(2);
      console.log(`[R2] Progreso: ${pct}% (${offset}/${size}) - ${speed} MB/s - ${elapsed.toFixed(0)}s`);
    }

    fs.closeSync(fd);

    await r2.send(new CompleteMultipartUploadCommand({
      Bucket: R2_BUCKET,
      Key: STAGING_KEY,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    }));
    console.log('[R2] Subida multipart completada.');
  } catch (e) {
    console.error('[R2] Abortando subida multipart por error:', e);
    await r2.send(new AbortMultipartUploadCommand({ Bucket: R2_BUCKET, Key: STAGING_KEY, UploadId: uploadId }));
    throw e;
  }
}

async function importIntoDirectus() {
  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: STAGING_KEY }),
    { expiresIn: 3600 }
  );

  const body = {
    url: signedUrl,
    data: { title: TITLE, filename_download: FILENAME_DOWNLOAD },
  };
  if (FOLDER) body.data.folder = FOLDER;

  const res = await fetch(`${DIRECTUS_BASE}/files/import`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  console.log('[Directus] Import status:', res.status);
  if (!res.ok) console.log('[Directus] Respuesta:', JSON.stringify(json));
  return json;
}

async function main() {
  await uploadMultipart();
  const result = await importIntoDirectus();

  if (result?.data?.id) {
    // El reproductor del sitio (app/api/video/[fileId]) busca el video en R2 bajo
    // la key "<id-del-archivo-en-directus>.mp4", no bajo la key temporal de staging.
    // Sin este paso el video se ve en el panel de Directus (que lo sirve desde su
    // propio disco) pero NO se reproduce en la web.
    const finalKey = `${result.data.id}.mp4`;
    const copySource = `${R2_BUCKET}/${STAGING_KEY.split('/').map(encodeURIComponent).join('/')}`;
    await r2.send(new CopyObjectCommand({ Bucket: R2_BUCKET, CopySource: copySource, Key: finalKey }));
    console.log('[R2] Copiado a la key final:', finalKey);

    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: STAGING_KEY }));
    console.log('[R2] Objeto temporal borrado.');
    console.log('');
    console.log('FILE_ID:', result.data.id);
    console.log('(Usa este ID en el campo "Video" de la clase en Directus)');
  } else {
    console.error('[Directus] El import no devolvio un id. El objeto temporal quedo en R2 para revisar:', STAGING_KEY);
    process.exit(1);
  }
}

main().catch(e => {
  console.error('ERROR:', e);
  process.exit(1);
});
