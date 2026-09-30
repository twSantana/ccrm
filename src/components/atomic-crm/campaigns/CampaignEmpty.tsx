import { Link } from "react-router";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CampaignEmpty = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
      <Megaphone className="h-8 w-8 text-muted-foreground" />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-foreground">Nenhuma campanha cadastrada</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Registre campanhas com influenciadoras para acompanhar investimentos e resultados.
      </p>
    </div>
    <Button asChild>
      <Link to="/campaigns/create">Criar primeira campanha</Link>
    </Button>
  </div>
);
