
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function checkToken() {
    try {
        const res = await axios.get(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("Usuario actual:", res.data.data.email);
        console.log("Rol ID:", res.data.data.role);

        const rolesRes = await axios.get(`${DIRECTUS_URL}/roles/${res.data.data.role}`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("Datos del Rol:", JSON.stringify(rolesRes.data.data, null, 2));

    } catch (e: any) {
        console.error("Error validando token:", e.response?.data || e.message);
    }
}

checkToken();
