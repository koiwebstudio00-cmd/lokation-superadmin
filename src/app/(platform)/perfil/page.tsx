import { callApi, getMe, type Security } from "@/lib/api";
import { PageHeading } from "@/components/page-heading";
import { ProfileSecurity } from "@/components/profile-security";
export default async function Page() { const [me, security] = await Promise.all([getMe(), callApi<Security>("/v1/platform/security")]); return <><PageHeading title="Mi perfil" description="Tus datos y métodos de acceso a la plataforma." /><ProfileSecurity me={me!} security={security} /></>; }
