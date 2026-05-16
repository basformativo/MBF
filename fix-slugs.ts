/**
 * fix-slugs.ts
 * Detecta clases con slug nulo, vacío o inválido y les asigna un slug
 * generado a partir del título. Luego hace PATCH en Directus.
 *
 * Uso: npx tsx fix-slugs.ts
 */

const DIRECTUS_URL = 'https://directuscontrol.basketformativo.com';
const ADMIN_TOKEN = 'WmX7KmV0IYu8uqyJoUnt7lCLRlDO-_9a';

// ---------- helpers ----------

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // quitar tildes
        .replace(/[^a-z0-9\s-]/g, '')       // solo alfanumérico y guiones
        .trim()
        .replace(/[\s]+/g, '-')             // espacios → guiones
        .replace(/-+/g, '-')                // guiones dobles → uno
        .replace(/^-+|-+$/g, '')            // trim guiones al inicio/fin
        .substring(0, 100);                 // máx 100 chars
}

function esSlugValido(slug: string | null | undefined): boolean {
    if (!slug || slug.trim() === '') return false;
    // Consideramos inválido si es muy corto (< 4 chars) o no tiene guión
    // (slugs reales como "Marcelo", "Intro", "Latino" quedan descartados)
    if (slug.length < 5) return false;
    if (!slug.includes('-')) return false;
    return true;
}

async function fetchWithAuth(path: string, options: RequestInit = {}) {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
    return res.json();
}

// ---------- main ----------

async function main() {
    console.log('\n🔧  Iniciando corrección de slugs en clases...\n');

    // 1. Obtener todas las clases
    const resp = await fetchWithAuth('/items/clases?fields=id,titulo,slug,orden,curso&limit=500');
    const clases: any[] = resp.data || [];

    console.log(`📦  Total clases encontradas: ${clases.length}\n`);

    // 2. Identificar las que necesitan slug
    const necesitanSlug = clases.filter(c => !esSlugValido(c.slug));

    if (necesitanSlug.length === 0) {
        console.log('✅  Todas las clases ya tienen slugs válidos. No hay nada que hacer.');
        return;
    }

    console.log(`⚠️  Clases con slug inválido o faltante: ${necesitanSlug.length}\n`);

    // 3. Recopilar slugs existentes válidos para garantizar unicidad
    const slugsExistentes = new Set(
        clases
            .filter(c => esSlugValido(c.slug))
            .map(c => c.slug)
    );

    // 4. Generar y asignar slugs únicos
    const actualizaciones: { id: string; tituloOriginal: string; slugAnterior: string; slugNuevo: string }[] = [];

    for (const clase of necesitanSlug) {
        let base = slugify(clase.titulo || `clase-${clase.id}`);
        let candidato = base;
        let contador = 2;

        // Resolver colisiones
        while (slugsExistentes.has(candidato)) {
            candidato = `${base}-${contador}`;
            contador++;
        }

        slugsExistentes.add(candidato);
        actualizaciones.push({
            id: clase.id,
            tituloOriginal: clase.titulo,
            slugAnterior: clase.slug || '(vacío)',
            slugNuevo: candidato,
        });
    }

    // 5. Mostrar el plan antes de ejecutar
    console.log('📋  Plan de actualización:');
    console.log('─'.repeat(80));
    for (const a of actualizaciones) {
        console.log(`  "${a.tituloOriginal}"`);
        console.log(`     Antes : ${a.slugAnterior}`);
        console.log(`     Después: ${a.slugNuevo}`);
        console.log();
    }
    console.log('─'.repeat(80));

    // 6. Ejecutar PATCHes
    let ok = 0;
    let errores = 0;

    for (const a of actualizaciones) {
        const resultado = await fetchWithAuth(`/items/clases/${a.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ slug: a.slugNuevo }),
        });

        if (resultado.data) {
            console.log(`✅  [${a.id}] slug actualizado → "${a.slugNuevo}"`);
            ok++;
        } else {
            console.error(`❌  [${a.id}] Error al actualizar:`, JSON.stringify(resultado));
            errores++;
        }
    }

    console.log('\n' + '═'.repeat(80));
    console.log(`  Resultado: ${ok} actualizadas ✅  |  ${errores} con error ❌`);
    console.log('═'.repeat(80) + '\n');
}

main().catch(console.error);
