
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function createNewAlumnoRole() {
    const POLICY_ID = '4ba84ce0-ab71-4a36-b650-eb286367029e';
    try {
        console.log("Intentando crear un nuevo rol vinculado a la política...");
        const res = await axios.post(`${DIRECTUS_URL}/roles`, {
            name: 'Alumno Academia',
            icon: 'school',
            policies: [POLICY_ID]
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("¡Éxito! Nuevo rol ID:", res.data.data.id);
    } catch (e: any) {
        console.error("Error:", e.response?.data || e.message);
    }
}

createNewAlumnoRole();
