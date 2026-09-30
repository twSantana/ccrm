import { memo } from "react";
import { Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Campaign } from "../types";
import { CAMPAIGN_STAGE_OPTIONS, getStageBadgeStyle } from "../campaigns/formatters";
import { Badge } from "@/components/ui/badge";

interface Props {
  campaigns: Campaign[];
  isPending: boolean;
}

export const DashboardCampaignStats = memo(({ campaigns, isPending }: Props) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const total = campaigns.length;
  const active = campaigns.filter((c) => c.stage !== "Finalizada" && c.stage !== "Cancelada").length;
  const finished = campaigns.filter((c) => c.stage === "Finalizada").length;
  const cancelled = campaigns.filter((c) => c.stage === "Cancelada").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
            <Megaphone className="h-4 w-4" />
            Total de Campanhas
          </div>
          <p className="text-3xl font-bold text-foreground">{total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-medium text-muted-foreground mb-1">Ativas</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{active}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-medium text-muted-foreground mb-1">Finalizadas</p>
          <p className="text-3xl font-bold text-foreground">{finished}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-medium text-muted-foreground mb-1">Canceladas</p>
          <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">{cancelled}</p>
        </CardContent>
      </Card>
    </div>
  );
});

// Funnel of campaigns by stage
interface FunnelProps {
  campaigns: Campaign[];
  isPending: boolean;
}

export const DashboardCampaignFunnel = memo(({ campaigns, isPending }: FunnelProps) => {
  const stageCounts = CAMPAIGN_STAGE_OPTIONS.map((opt) => ({
    stage: opt.name,
    count: campaigns.filter((c) => c.stage === opt.id).length,
  }));

  const maxCount = Math.max(...stageCounts.map((s) => s.count), 1);

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {stageCounts.map(({ stage, count }) => (
        <div key={stage} className="flex items-center gap-3">
          <div className="w-28 shrink-0">
            <Badge className={`text-xs w-full justify-center ${getStageBadgeStyle(stage)}`}>
              {stage}
            </Badge>
          </div>
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-500"
              style={{ width: maxCount > 0 ? `${(count / maxCount) * 100}%` : "0%" }}
            />
          </div>
          <span className="w-6 text-right text-sm font-semibold text-foreground shrink-0">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
});

DashboardCampaignStats.displayName = "DashboardCampaignStats";
DashboardCampaignFunnel.displayName = "DashboardCampaignFunnel";
