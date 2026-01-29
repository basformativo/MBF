
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function grantReadToAlumnoPolicy() {
    const POLICY_ID = '4ba84ce0-ab71-4a36-b650-eb286367029e';
    try {
        console.log("Intentando dar lectura a política Alumnos...");
        const res = await axios.post(`${DIRECTUS_URL}/permissions`, {
            policy: POLICY_ID,
            collection: 'cursos',
            action: 'read',
            fields: ['*']
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("¡Permiso otorgado!");
    } catch (e: any) {
        console.error("Error:", e.response?.data || e.message);
    }
}

grantReadToAlumnoPolicy();
