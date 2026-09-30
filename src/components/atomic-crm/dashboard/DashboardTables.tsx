import { memo, useMemo } from "react";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Campaign, Influencer } from "../types";
import { calculateLucro, calculateROI } from "../types";
import {
  formatCurrency,
  formatROI,
  getLucroColor,
  getROIColor,
} from "../campaigns/formatters";

interface InfluencerMetrics {
  influencer_id: number | string;
  name: string;
  campaignCount: number;
  totalInvestment: number;
  totalCommission: number;
  totalLucro: number;
  roi: number;
}

function buildMetrics(
  campaigns: Campaign[],
  influencers: Influencer[]
): InfluencerMetrics[] {
  const influencerMap = new Map(influencers.map((inf) => [String(inf.id), inf]));

  const metricsMap = new Map<string, InfluencerMetrics>();

  for (const c of campaigns) {
    const key = String(c.influencer_id);
    const inf = influencerMap.get(key);
    if (!metricsMap.has(key)) {
      metricsMap.set(key, {
        influencer_id: c.influencer_id,
        name: inf?.name ?? `Influenciadora #${key}`,
        campaignCount: 0,
        totalInvestment: 0,
        totalCommission: 0,
        totalLucro: 0,
        roi: 0,
      });
    }
    const m = metricsMap.get(key)!;
    m.campaignCount += 1;
    m.totalInvestment += c.investment ?? 0;
    m.totalCommission += c.commission ?? 0;
  }

  // Compute derived fields
  const list = Array.from(metricsMap.values()).map((m) => ({
    ...m,
    totalLucro: calculateLucro(m.totalCommission, m.totalInvestment),
    roi: calculateROI(m.totalCommission, m.totalInvestment),
  }));

  // Sort by lucro desc
  return list.sort((a, b) => b.totalLucro - a.totalLucro);
}

interface Props {
  campaigns: Campaign[];
  influencers: Influencer[];
  isPending: boolean;
}

export const DashboardInfluencerPerformance = memo(
  ({ campaigns, influencers, isPending }: Props) => {
    const metrics = useMemo(
      () => buildMetrics(campaigns, influencers),
      [campaigns, influencers]
    );

    if (isPending) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      );
    }

    if (!metrics.length) {
      return (
        <p className="text-sm text-muted-foreground italic">
          Nenhuma campanha cadastrada ainda.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Influenciadora</TableHead>
              <TableHead className="text-right">Campanhas</TableHead>
              <TableHead className="text-right">Investimento</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
              <TableHead className="text-right">Lucro</TableHead>
              <TableHead className="text-right">ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((m, idx) => (
              <TableRow key={String(m.influencer_id)} className="hover:bg-muted/50 transition-colors">
                <TableCell className="text-muted-foreground font-medium">{idx + 1}</TableCell>
                <TableCell className="font-semibold">
                  <Link
                    to={`/influencers/${m.influencer_id}/show`}
                    className="hover:underline text-foreground"
                  >
                    {m.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {m.campaignCount}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(m.totalInvestment)}</TableCell>
                <TableCell className="text-right">{formatCurrency(m.totalCommission)}</TableCell>
                <TableCell className={`text-right font-semibold ${getLucroColor(m.totalLucro)}`}>
                  {formatCurrency(m.totalLucro)}
                </TableCell>
                <TableCell className={`text-right font-semibold ${getROIColor(m.roi)}`}>
                  {formatROI(m.roi)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
);

DashboardInfluencerPerformance.displayName = "DashboardInfluencerPerformance";

// ─────────────────────────────────────────────
// Recent Campaigns section
// ─────────────────────────────────────────────

interface RecentProps {
  campaigns: Campaign[];
  influencers: Influencer[];
  isPending: boolean;
}

export const DashboardRecentCampaigns = memo(
  ({ campaigns, influencers, isPending }: RecentProps) => {
    const influencerMap = new Map(influencers.map((inf) => [String(inf.id), inf]));

    const recent = useMemo(
      () =>
        [...campaigns]
          .sort(
            (a, b) =>
              new Date(b.created_at ?? 0).getTime() -
              new Date(a.created_at ?? 0).getTime()
          )
          .slice(0, 8),
      [campaigns]
    );

    if (isPending) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      );
    }

    if (!recent.length) {
      return (
        <p className="text-sm text-muted-foreground italic">
          Nenhuma campanha cadastrada ainda.
        </p>
      );
    }

    return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((c) => {
              const lucro = calculateLucro(c.commission ?? 0, c.investment ?? 0);
              const roi = calculateROI(c.commission ?? 0, c.investment ?? 0);
              const inf = influencerMap.get(String(c.influencer_id));
              return (
                <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-semibold">
                    <Link
                      to={`/campaigns/${c.id}/show`}
                      className="hover:underline text-foreground"
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inf ? (
                      <Link
                        to={`/influencers/${inf.id}/show`}
                        className="hover:underline"
                      >
                        {inf.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {c.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(c.investment)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(c.commission)}</TableCell>
                  <TableCell className={`text-right font-semibold ${getLucroColor(lucro)}`}>
                    {formatCurrency(lucro)}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getROIColor(roi)}`}>
                    {formatROI(roi)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
);

DashboardRecentCampaigns.displayName = "DashboardRecentCampaigns";
