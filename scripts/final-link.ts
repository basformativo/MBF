
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function finalLinkAttempt() {
    const ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';
    const POLICY_ID = '4ba84ce0-ab71-4a36-b650-eb286367029e';

    try {
        console.log("Intento final de vinculación vía Junction Object...");
        await axios.patch(`${DIRECTUS_URL}/roles/${ROLE_ID}`, {
            policies: [
                {
                    policy: POLICY_ID
                }
            ]
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("¡POR FIN EXITO!");
    } catch (e: any) {
        console.error("Fallo:", e.response?.data || e.message);

        console.log("Probando vinculación inversa (Políticas -> roles)...");
        try {
            await axios.patch(`${DIRECTUS_URL}/policies/${POLICY_ID}`, {
                roles: [
                    {
                        role: ROLE_ID
                    }
                ]
            }, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
            });
            console.log("¡VINCULACION INVERSA EXITOSA!");
        } catch (e2: any) {
            console.error("Fallo Inverso:", e2.response?.data || e2.message);
        }
    }
}

finalLinkAttempt();
