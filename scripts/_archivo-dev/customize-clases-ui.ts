
import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function customizeClasesFields() {
    try {
        console.log("Personalizando campos de la colección 'clases'...");

        // 1. Duración: Lo ponemos como solo lectura con una nota (la extracción automática requiere hooks de servidor)
        await client.request(updateField('clases', 'duracion', {
            meta: {
                interface: 'input',
                readonly: true,
                note: "Este campo se calcula automáticamente desde los metadatos del video."
            }
        }));
        console.log("- Campo 'duracion' configurado como solo lectura.");

        // 2. Es Gratis: Cambiar a Dropdown con etiquetas claras
        await client.request(updateField('clases', 'es_gratis', {
            type: 'boolean',
            meta: {
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: "Gratis (Vista Previa)", value: true },
                        { text: "Solo para Alumnos (De pago)", value: false }
                    ]
                },
                width: 'half'
            }
        }));
        console.log("- Campo 'es_gratis' configurado con dropdown.");

        // 3. Orden: Lista desplegable del 1 al 10
        const ordenChoices = Array.from({ length: 10 }, (_, i) => ({
            text: `Clase ${i + 1}`,
            value: i + 1
        }));

        await client.request(updateField('clases', 'orden', {
            type: 'integer',
            meta: {
                interface: 'select-dropdown',
                options: {
                    choices: ordenChoices
                },
                width: 'half'
            }
        }));
        console.log("- Campo 'orden' configurado con opciones 1-10.");

        console.log("¡Configuración de campos completada!");
    } catch (e: any) {
        console.error("Error personalizado:", e.message || e);
    }
}

customizeClasesFields();
