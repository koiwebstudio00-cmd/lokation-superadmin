import { TenantForm } from "@/app/tenant-form";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
export default function Page() { return <><PageHeading title="Nueva inmobiliaria" description="El primer paso para que tu cliente empiece a trabajar con Lokation." /><Card className="max-w-3xl"><CardHeader><CardTitle>Datos de la cuenta</CardTitle><CardDescription>Su administrador recibirá una invitación para crear su contraseña.</CardDescription></CardHeader><CardContent><TenantForm /></CardContent></Card></>; }
