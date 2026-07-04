
import axios from 'axios';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function setupAlumnoPolicy() {
    try {
        console.log("Intentando crear Política Alumnos...");
        const res = await axios.post(`${DIRECTUS_URL}/policies`, {
            name: 'Alumnos',
            icon: 'school',
            description: 'Política para estudiantes'
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });

        const policyId = res.data.data.id;
        console.log("Política creada con ID:", policyId);

        console.log("Asociando Rol Alumno a esta política...");
        const ALUMNO_ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';

        // En v11, asociamos el rol a la política actualizando la política o el rol
        // Pero el rol 'Alumno' tiene un array 'policies'.
        await axios.patch(`${DIRECTUS_URL}/roles/${ALUMNO_ROLE_ID}`, {
            policies: [policyId]
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log("Rol Alumno actualizado!");

        // Agregar permisos de lectura
        const cols = ['cursos', 'clases', 'noticias', 'instructores', 'categorias', 'directus_files'];
        for (const col of cols) {
            console.log(`Otorgando lectura a ${col}...`);
            await axios.post(`${DIRECTUS_URL}/permissions`, {
                policy: policyId,
                collection: col,
                action: 'read',
                fields: ['*']
            }, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
            }).catch(e => console.log(`Error en ${col}:`, e.response?.data?.errors?.[0]?.message || e.message));
        }

        console.log("Habilitando Registro Público...");
        const PUBLIC_POLICY_ID = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';
        await axios.post(`${DIRECTUS_URL}/permissions`, {
            policy: PUBLIC_POLICY_ID,
            collection: 'directus_users',
            action: 'create',
            fields: ['email', 'password', 'first_name', 'last_name', 'role']
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        }).catch(e => console.log(`Error en Public User Create:`, e.response?.data?.errors?.[0]?.message || e.message));

    } catch (e: any) {
        console.error("Fallo Fatal:", e.response?.data || e.message);
    }
}

setupAlumnoPolicy();
