import { EditBase, Form, useEditContext, useNotify } from "ra-core";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormToolbar } from "../layout/FormToolbar";
import type { Influencer } from "../types";
import { InfluencerInputs } from "./InfluencerInputs";

export const InfluencerEdit = () => {
  const notify = useNotify();

  return (
    <EditBase
      redirect="list"
      transform={(data: Influencer) => ({
        ...data,
        updated_at: new Date().toISOString(),
      })}
      mutationOptions={{
        onSuccess: () => {
          notify("Influenciador atualizado com sucesso!", { type: "success" });
        },
        onError: (error: any) => {
          notify(`Erro ao atualizar influenciador: ${error?.message || "Tente novamente"}`, {
            type: "error",
          });
        },
      }}
    >
      <InfluencerEditContent />
    </EditBase>
  );
};

const InfluencerEditContent = () => {
  const { isPending, record } = useEditContext<Influencer>();

  if (isPending || !record) return null;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link to="/influencers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Editar Influenciador: {record.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Altere os dados de perfil, público ou contato.
          </p>
        </div>
      </div>

      <Form>
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
  );
};
