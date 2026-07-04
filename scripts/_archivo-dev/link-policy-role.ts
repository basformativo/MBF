
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function updatePolicyRoles() {
    const POLICY_ID = '4ba84ce0-ab71-4a36-b650-eb286367029e';
    const ALUMNO_ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';

    try {
        console.log("Intentando actualizar la política con el rol...");
        const res = await axios.patch(`${DIRECTUS_URL}/policies/${POLICY_ID}`, {
            roles: [ALUMNO_ROLE_ID]
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("Resultado política:", res.status);

    } catch (e: any) {
        console.error("Error Política:", e.response?.data || e.message);
    }
}

updatePolicyRoles();
