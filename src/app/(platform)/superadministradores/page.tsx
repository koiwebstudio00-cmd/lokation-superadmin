import { callApi, getMe, type Operator } from "@/lib/api";
import { PageHeading } from "@/components/page-heading";
import { OperatorManager } from "@/components/operator-manager";
export default async function Page() {
  const [me, { data }] = await Promise.all([getMe(), callApi<{ data: Operator[] }>("/v1/platform/operators")]);
  return <><PageHeading title="Superadministradores" description="Administrá quiénes pueden operar y supervisar Ubikka." /><OperatorManager users={data} currentId={me!.id} /></>;
}
