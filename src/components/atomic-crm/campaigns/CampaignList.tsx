import { RecordContextProvider, useGetOne, useListContext } from "ra-core";
import { Link } from "react-router";
import { Edit, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { List } from "@/components/admin/list";
import { TopToolbar } from "../layout/TopToolbar";
import type { Campaign, Influencer } from "../types";
import { calculateLucro, calculateROI } from "../types";
import {
  formatCurrency,
  formatROI,
  getLucroColor,
  getROIColor,
  getStageBadgeStyle,
} from "./formatters";
import { CampaignListFilter } from "./CampaignListFilter";
import { CampaignEmpty } from "./CampaignEmpty";

export const CampaignList = () => (
  <List
    title={false}
    actions={<CampaignListActions />}
    perPage={25}
    sort={{ field: "created_at", order: "DESC" }}
  >
    <CampaignListLayout />
  </List>
);

const CampaignListActions = () => (
  <TopToolbar>
    <Button asChild>
      <Link to="/campaigns/create">
        <Plus className="mr-2 h-4 w-4" /> Nova Campanha
      </Link>
    </Button>
  </TopToolbar>
);

const InfluencerName = ({ id }: { id: number | string }) => {
  const { data } = useGetOne<Influencer>("influencers", { id });
  return <span>{data?.name ?? "—"}</span>;
};

const CampaignListLayout = () => {
  const { data: campaigns, isPending, error, filterValues } = useListContext<Campaign>();
  const hasFilters = filterValues && Object.keys(filterValues).length > 0;

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
        <p className="font-semibold">Erro ao carregar campanhas.</p>
        <p className="text-sm">{error.message || "Verifique sua conexão e tente novamente."}</p>
      </div>
    );
  }

  if (!campaigns?.length && !hasFilters) {
    return <CampaignEmpty />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Campanhas</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe investimentos, vendas e ROI de cada campanha com influenciadoras.
          </p>
        </div>
        <div>
          <Button asChild className="sm:hidden">
            <Link to="/campaigns/create">
              <Plus className="mr-2 h-4 w-4" /> Nova Campanha
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <CampaignListFilter />

        {/* Table */}
        <div className="flex-1 min-w-0">
          <Card className="py-0 overflow-hidden">
            <CardContent className="p-0">
              {campaigns?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma campanha encontrada com os filtros aplicados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Influenciadora</TableHead>
                        <TableHead>Estágio</TableHead>
                        <TableHead className="text-right">Investimento</TableHead>
                        <TableHead className="text-right">Comissão</TableHead>
                        <TableHead className="text-right">Lucro</TableHead>
                        <TableHead className="text-right">ROI</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns?.map((campaign) => {
                        const lucro = calculateLucro(campaign.commission ?? 0, campaign.investment ?? 0);
                        const roi = calculateROI(campaign.commission ?? 0, campaign.investment ?? 0);

                        return (
                          <RecordContextProvider key={campaign.id} value={campaign}>
                            <TableRow className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <Link
                                    to={`/campaigns/${campaign.id}/show`}
                                    className="hover:underline text-foreground font-semibold"
                                  >
                                    {campaign.name}
                                  </Link>
                                  {campaign.infoproduct_name && (
                                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                                      {campaign.infoproduct_name}
                                    </span>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="text-muted-foreground">
                                <InfluencerName id={campaign.influencer_id} />
                              </TableCell>

                              <TableCell>
                                <Badge className={`text-xs ${getStageBadgeStyle(campaign.stage)}`}>
                                  {campaign.stage}
                                </Badge>
                              </TableCell>

                              <TableCell className="text-right font-medium">
                                {formatCurrency(campaign.investment)}
                              </TableCell>

                              <TableCell className="text-right font-medium">
                                {formatCurrency(campaign.commission)}
                              </TableCell>

                              <TableCell className={`text-right font-semibold ${getLucroColor(lucro)}`}>
                                {formatCurrency(lucro)}
                              </TableCell>

                              <TableCell className={`text-right font-semibold ${getROIColor(roi)}`}>
                                {formatROI(roi)}
                              </TableCell>

                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" asChild title="Ver detalhes">
                                    <Link to={`/campaigns/${campaign.id}/show`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button variant="ghost" size="icon" asChild title="Editar">
                                    <Link to={`/campaigns/${campaign.id}`}>
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <DeleteButton
                                    resource="campaigns"
                                    size="icon"
                                    variant="ghost"
                                    redirect={false}
                                    confirmTitle="Excluir campanha"
                                    confirmContent="Tem certeza que deseja excluir esta campanha?"
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          </RecordContextProvider>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
