"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function ErrorPage({ reset }: { reset: () => void }) { return <Card><CardHeader><CardTitle>No pudimos cargar esta página</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Comprobá que el backend esté disponible y volvé a intentar.</p><Button onClick={reset}>Reintentar</Button></CardContent></Card>; }
