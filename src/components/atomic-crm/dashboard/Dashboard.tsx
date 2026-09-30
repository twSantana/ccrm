import { useGetList } from "ra-core";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Campaign, Influencer } from "../types";
import { DashboardKpiCards } from "./DashboardKpiCards";
import { DashboardCampaignStats, DashboardCampaignFunnel } from "./DashboardCampaignStats";
import { DashboardFinancialChart } from "./DashboardFinancialChart";
import { DashboardInfluencerPerformance, DashboardRecentCampaigns } from "./DashboardTables";
import { DashboardEmpty } from "./DashboardEmpty";

export const Dashboard = () => {
  // Single batch fetch for campaigns and influencers
  const {
    data: campaigns = [],
    isPending: isPendingCampaigns,
    error: errorCampaigns,
  } = useGetList<Campaign>("campaigns", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "created_at", order: "DESC" },
  });

  const {
    data: influencers = [],
    isPending: isPendingInfluencers,
    error: errorInfluencers,
  } = useGetList<Influencer>("influencers", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "name", order: "ASC" },
  });

  const isPending = isPendingCampaigns || isPendingInfluencers;
  const hasError = !!errorCampaigns || !!errorInfluencers;

  // Error state
  if (hasError) {
    return (
      <div className="mt-4 p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Erro ao carregar o dashboard</p>
          <p className="text-sm">
            {errorCampaigns?.message || errorInfluencers?.message || "Verifique sua conexão e recarregue a página."}
          </p>
        </div>
      </div>
    );
  }

  // Empty state (only when done loading and nothing exists)
  const isEmpty = !isPending && campaigns.length === 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral financeira das campanhas com influenciadoras
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardKpiCards campaigns={campaigns} isPending={isPending} />

      {/* Campaign Stats */}
      <DashboardCampaignStats campaigns={campaigns} isPending={isPending} />

      {/* Empty state */}
      {isEmpty && <DashboardEmpty />}

      {/* Chart + Funnel - only shown when there is data */}
      {!isEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Resultado por Campanha
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Investimento, Comissão e Lucro — últimas 10 campanhas
              </p>
            </CardHeader>
            <CardContent>
              <DashboardFinancialChart campaigns={campaigns} isPending={isPending} />
            </CardContent>
          </Card>

          {/* Stage Funnel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Funil de Campanhas
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Distribuição por estágio
              </p>
            </CardHeader>
            <CardContent>
              <DashboardCampaignFunnel campaigns={campaigns} isPending={isPending} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Influencer Performance */}
      {!isEmpty && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Performance das Influenciadoras
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Métricas por influenciadora, ordenadas por Lucro
            </p>
          </CardHeader>
          <CardContent>
            <DashboardInfluencerPerformance
              campaigns={campaigns}
              influencers={influencers}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Recent Campaigns */}
      {!isEmpty && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Campanhas Recentes
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              As 8 últimas campanhas cadastradas
            </p>
          </CardHeader>
          <CardContent>
            <DashboardRecentCampaigns
              campaigns={campaigns}
              influencers={influencers}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
