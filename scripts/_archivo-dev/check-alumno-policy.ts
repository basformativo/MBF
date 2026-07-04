
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function checkAlumnoPolicy() {
    const POLICY_ID = '4ba84ce0-ab71-4a36-b650-eb286367029e';
    try {
        const res = await axios.get(`${DIRECTUS_URL}/policies/${POLICY_ID}`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("Datos de la política Alumnos:", JSON.stringify(res.data.data, null, 2));
    } catch (e: any) {
        console.error("Error:", e.response?.data || e.message);
    }
}

checkAlumnoPolicy();
