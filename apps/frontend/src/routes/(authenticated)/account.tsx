import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth.ts";
import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from "@tanstack/react-router";
import { Field, FieldLabel } from "@/components/ui/field";

export const Route = createFileRoute('/(authenticated)/account')({
  component: RouteComponent,
  
})


function RouteComponent() {
    const navigate = useNavigate();
    const session = authClient.useSession();
    const user = session.data?.user;
  
  return <main className="min-h-[calc(100vh-65px)] bg-muted px-5 py-6 text-slate-950 sm:px-8 lg:px-14 lg:py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Ustawienia</CardTitle>
                    <CardDescription>Dane użytkownika</CardDescription>
                    <Field>
                        <FieldLabel className="justify-start -mt-1">Twoja nazwa: {user.name}<Button variant="secondary">zmień nazwę</Button></FieldLabel>
                        <FieldLabel className="justify-start -mt-1">Twoje hasło: *******<Button variant="secondary">zmień hasło</Button></FieldLabel>
                    </Field>
                    <CardDescription>Sesje użytkownika</CardDescription>
                    <Field>
                        <FieldLabel>[Tu będą sesje]</FieldLabel>
                    </Field>
                </CardHeader>
                <CardFooter className="mt-auto">
                    <Button onClick={() => navigate({ to: "/" })} className="w-full">Wróć na stronę główną</Button>
                </CardFooter>
            </Card>
        </main>
}