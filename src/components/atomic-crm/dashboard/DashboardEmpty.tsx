import { Link } from "react-router";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const DashboardEmpty = () => (
  <Card className="mt-6">
    <CardContent className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Megaphone className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Ainda não existem campanhas cadastradas
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Cadastre influenciadoras e crie campanhas para começar a acompanhar
          investimentos, comissões e ROI.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link to="/influencers/create">Cadastrar Influenciadora</Link>
        </Button>
        <Button asChild>
          <Link to="/campaigns/create">Criar Primeira Campanha</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);
