import { CreateButton } from "@/components/admin/create-button";
import { Users } from "lucide-react";

export const InfluencerEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-card text-card-foreground">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        Nenhum influenciador cadastrado ainda.
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Cadastre seus influenciadores para gerenciar contatos, públicos e iniciar parcerias.
      </p>
      <CreateButton label="Adicionar primeiro influenciador" />
    </div>
  );
};
