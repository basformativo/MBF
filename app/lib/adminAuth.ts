import { createDirectus, rest, staticToken, readMe, readRoles } from '@directus/sdk';
import { DIRECTUS_URL, adminClient } from './directus';

export interface AdminUser {
    id: string;
    role: string;
    first_name?: string;
}

// Verifica la cookie de sesión contra Directus y confirma que el rol tenga admin_access.
// admin_access vive en las Access Policies del rol (directus_policies), no en el rol
// directamente: hay que resolver role -> policies -> policy.admin_access.
// Devuelve null si no hay sesión, la sesión es inválida, o el usuario no es admin.
export async function getAdminUser(sessionToken: string | undefined): Promise<AdminUser | null> {
    if (!sessionToken) return null;

    const userClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(sessionToken));
    let user: any;
    try {
        user = await userClient.request(readMe({ fields: ['id', 'role', 'first_name'] }));
    } catch {
        return null;
    }

    try {
        const roles = await adminClient.request(
            readRoles({
                filter: { id: { _eq: user.role } },
                fields: ['id', { policies: [{ policy: ['admin_access'] }] }] as any,
                limit: 1,
            })
        );
        const policies = (roles as any[])[0]?.policies ?? [];
        const isAdmin = policies.some((p: any) => p.policy?.admin_access === true);
        return isAdmin ? user : null;
    } catch {
        return null;
    }
}
