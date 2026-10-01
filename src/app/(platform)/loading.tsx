import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() { return <div className="space-y-6" aria-label="Cargando"><Skeleton className="h-10 w-60" /><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map(n => <Skeleton key={n} className="h-32" />)}</div><Skeleton className="h-72 w-full" /></div>; }
