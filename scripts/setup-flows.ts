
import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function createFlows() {
    try {
        const flowAcceso = {
            name: "Acceso Automático post-Compra",
            icon: "check_circle",
            trigger: "event",
            status: "active",
            options: {
                type: "action",
                scope: ["items.create"],
                collections: ["compras"]
            }
        };

        console.log("Registrando Flujo...");
        // @ts-ignore
        const flowResponse = await client.request(() => ({
            path: '/flows',
            method: 'POST',
            body: JSON.stringify(flowAcceso)
        }));

        const operationAcceso = {
            name: "Crear Acceso",
            key: "create_access",
            type: "item-create",
            flow: flowResponse.id,
            position_x: 20,
            position_y: 20,
            options: {
                collection: "accesos_cursos",
                payload: {
                    usuario: "{{$trigger.payload.usuario}}",
                    curso: "{{$trigger.payload.curso}}",
                    fecha_inicio: "$NOW",
                    activo: true
                }
            }
        };

        console.log("Registrando Operación...");
        // @ts-ignore
        await client.request(() => ({
            path: '/operations',
            method: 'POST',
            body: JSON.stringify(operationAcceso)
        }));

        console.log("¡Flujo configurado correctamente!");

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

createFlows();
