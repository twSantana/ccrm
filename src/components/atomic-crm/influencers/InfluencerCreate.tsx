import {
  CreateBase,
  Form,
  useGetIdentity,
  useNotify,
  useRedirect,
} from "ra-core";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormToolbar } from "../layout/FormToolbar";
import type { Influencer } from "../types";
import { InfluencerInputs } from "./InfluencerInputs";

export const InfluencerCreate = () => {
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <CreateBase
      redirect="list"
      transform={(data: Influencer) => ({
        ...data,
        status: data.status || "Prospectada",
        assigned_user_id: data.assigned_user_id || identity?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })}
      mutationOptions={{
        onSuccess: () => {
          notify("Influenciador criado com sucesso!", { type: "success" });
          redirect("/influencers");
        },
        onError: (error: any) => {
          notify(`Erro ao criar influenciador: ${error?.message || "Tente novamente"}`, {
            type: "error",
          });
        },
      }}
    >
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/influencers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Novo Influenciador</h1>
            <p className="text-sm text-muted-foreground">
              Cadastre as informações de audiência e contato da influenciadora.
            </p>
          </div>
        </div>

        <Form
          defaultValues={{
            status: "Prospectada",
            assigned_user_id: identity?.id,
            tags: [],
          }}
        >
          <Card>
            <CardContent className="pt-6">
              <InfluencerInputs />
              <div className="mt-6 pt-4 border-t">
                <FormToolbar />
              </div>
            </CardContent>
          </Card>
        </Form>
      </div>
    </CreateBase>
  );
};
