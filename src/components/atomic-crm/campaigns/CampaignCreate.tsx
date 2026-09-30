import { CreateBase, Form, useNotify, useRedirect } from "ra-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { CampaignInputs } from "./CampaignInputs";

export const CampaignCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <CreateBase
      mutationOptions={{
        onSuccess: () => {
          notify("Campanha criada com sucesso", { type: "success" });
          redirect("/campaigns");
        },
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Nova Campanha
            </h1>
            <p className="text-sm text-muted-foreground">
              Cadastre uma nova campanha com uma influenciadora
            </p>
          </div>
        </div>

        <Form>
          <Card>
            <CardHeader>
              <CardTitle>Dados da Campanha</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignInputs />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" asChild>
              <Link to="/campaigns">Cancelar</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Campanha
            </Button>
          </div>
        </Form>
      </div>
    </CreateBase>
  );
};
