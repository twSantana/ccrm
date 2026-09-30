import { ShowBase, useGetOne, useShowContext } from "ra-core";
import { Link } from "react-router";
import { ArrowLeft, Calendar, Edit, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { calculateLucro, calculateROI, type Campaign, type Influencer } from "../types";
import {
  formatCurrency,
  formatROI,
  getLucroColor,
  getROIColor,
  getStageBadgeStyle,
} from "./formatters";

export const CampaignShow = () => (
  <ShowBase>
    <CampaignShowContent />
  </ShowBase>
);

const CampaignShowContent = () => {
  const { record, isPending } = useShowContext<Campaign>();
  const { data: influencer } = useGetOne<Influencer>(
    "influencers",
    { id: record?.influencer_id ?? 0 },
    { enabled: !!record?.influencer_id }
  );

  if (isPending || !record) return null;

  const lucro = calculateLucro(record.commission ?? 0, record.investment ?? 0);
  const roi = calculateROI(record.commission ?? 0, record.investment ?? 0);

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {record.name}
              </h1>
              {record.stage && (
                <Badge className={getStageBadgeStyle(record.stage)}>
                  {record.stage}
                </Badge>
              )}
            </div>
            {influencer && (
              <p className="text-sm text-muted-foreground">
                Influenciadora:{" "}
                <Link
                  to={`/influencers/${influencer.id}/show`}
                  className="text-primary hover:underline"
                >
                  {influencer.name}
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/campaigns/${record.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Link>
          </Button>
          <DeleteButton
            resource="campaigns"
            redirect="/campaigns"
            confirmTitle="Excluir campanha"
            confirmContent="Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita."
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Investimento</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(record.investment)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Vendas Brutas</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(record.gross_sales)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Comissão</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(record.commission)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>ROI</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${getROIColor(roi)}`}>
              {formatROI(roi)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Resultado Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Investimento</span>
              <span className="font-semibold">{formatCurrency(record.investment)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Vendas Brutas</span>
              <span className="font-semibold">{formatCurrency(record.gross_sales)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Comissão</span>
              <span className="font-semibold">{formatCurrency(record.commission)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground font-medium">Lucro Líquido</span>
              <span className={`font-bold text-lg ${getLucroColor(lucro)}`}>
                {formatCurrency(lucro)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground font-medium">ROI</span>
              <span className={`font-bold text-lg ${getROIColor(roi)}`}>
                {formatROI(roi)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes da Campanha */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Infoproduto</span>
              <span className="font-medium text-right max-w-[180px] truncate">
                {record.infoproduct_name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Estágio</span>
              <Badge className={getStageBadgeStyle(record.stage)}>
                {record.stage}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Início
              </span>
              <span className="font-medium">{formatDate(record.start_date)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Término
              </span>
              <span className="font-medium">{formatDate(record.end_date)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {record.notes || "Nenhuma observação registrada."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
