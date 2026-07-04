
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function checkFinal() {
    const ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';
    try {
        const roleRes = await axios.get(`${DIRECTUS_URL}/roles/${ROLE_ID}`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        const policyIds = roleRes.data.data.policies;
        console.log("Políticas vinculadas al rol Alumno:", policyIds);

        for (const pId of policyIds) {
            const pRes = await axios.get(`${DIRECTUS_URL}/policies/${pId}`, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
            });
            console.log(`- Política ${pId}: ${pRes.data.data.name}`);
        }
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

checkFinal();
