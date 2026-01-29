
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function grantAllReadToAlumno() {
    const POLICY_ID = '4ba84ce0-ab71-4a36-b650-eb286367029e';
    const collections = ['cursos', 'clases', 'instructores', 'categorias', 'noticias', 'directus_files'];

    try {
        for (const col of collections) {
            console.log(`Otorgando lectura a ${col}...`);
            await axios.post(`${DIRECTUS_URL}/permissions`, {
                policy: POLICY_ID,
                collection: col,
                action: 'read',
                fields: ['*']
            }, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
            }).catch(e => {
                if (e.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
                    console.log(`Ya existe el permiso para ${col}`);
                } else {
                    console.error(`Error en ${col}:`, e.response?.data || e.message);
                }
            });
        }

        console.log("Configurando permisos de progreso para alumnos...");
        await axios.post(`${DIRECTUS_URL}/permissions`, {
            policy: POLICY_ID,
            collection: 'progreso_clases',
            action: 'create',
            fields: ['*']
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        }).catch(() => { });

        await axios.post(`${DIRECTUS_URL}/permissions`, {
            policy: POLICY_ID,
            collection: 'progreso_clases',
            action: 'read',
            fields: ['*'],
            permissions: { usuario: { _eq: '$CURRENT_USER' } }
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        }).catch(() => { });

        console.log("¡Permisos de Alumno configurados en la política!");

    } catch (e: any) {
        console.error("Fallo:", e.message);
    }
}

grantAllReadToAlumno();
