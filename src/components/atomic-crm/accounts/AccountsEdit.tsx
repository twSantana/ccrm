import { EditBase, Form, useNotify, useRedirect } from "ra-core";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountsInputs } from "./AccountsInputs";

export const AccountsEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <EditBase
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: () => {
          notify("Conta do Instagram atualizada.", { type: "success" });
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
            <h1 className="text-2xl font-bold">Editar conta do Instagram</h1>
            <p className="text-sm text-muted-foreground">
              Troque a senha somente se quiser atualizar a credencial salva.
            </p>
          </div>
        </div>

        <Form>
          <Card>
            <CardHeader>
              <CardTitle>Dados da conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AccountsInputs editing />
              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </Form>
      </div>
    </EditBase>
  );
};
