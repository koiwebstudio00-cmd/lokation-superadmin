import { Card, CardContent } from "@/components/ui/card";
export function Metrics({ items }: { items: { label: string; value: number; note?: string }[] }) {
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{items.map(item => <Card key={item.label} className="min-w-0 py-5"><CardContent className="px-4 sm:px-6"><p className="text-xs leading-5 text-muted-foreground">{item.label}</p><p className="mt-2 font-mono text-3xl font-medium tracking-tight">{item.value.toLocaleString("es-AR")}</p>{item.note && <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>}</CardContent></Card>)}</div>;
}
