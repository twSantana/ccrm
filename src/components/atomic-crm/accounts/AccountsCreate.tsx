import { CreateBase, Form, useNotify, useRedirect } from "ra-core";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountsInputs } from "./AccountsInputs";

export const AccountsCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <CreateBase
      mutationOptions={{
        onSuccess: () => {
          notify("Conta do Instagram cadastrada.", { type: "success" });
          redirect("/accounts");
        },
      }}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/accounts" aria-label="Voltar para contas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Nova conta do Instagram</h1>
            <p className="text-sm text-muted-foreground">
              A senha é criptografada antes de ser armazenada.
            </p>
          </div>
        </div>

        <Form>
          <Card>
            <CardHeader>
              <CardTitle>Dados da conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AccountsInputs />
              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </Form>
      </div>
    </CreateBase>
  );
};
