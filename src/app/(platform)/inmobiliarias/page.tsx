import Link from "next/link";
import { Plus } from "lucide-react";
import { callApi, type Tenant } from "@/lib/api";
import { TenantList } from "@/app/tenant-list";
import { LiveRefresh } from "@/app/live-refresh";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
export default async function Page() {
  const { data } = await callApi<{ data: Tenant[] }>("/v1/tenants");
  return <><PageHeading title="Inmobiliarias" description="Gestioná las cuentas, sus accesos y su presencia en la web."><LiveRefresh /><Button asChild><Link href="/inmobiliarias/nueva"><Plus />Nueva inmobiliaria</Link></Button></PageHeading><TenantList tenants={data} /></>;
}
