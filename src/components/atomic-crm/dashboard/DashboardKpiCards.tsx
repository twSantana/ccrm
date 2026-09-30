import { memo } from "react";
import { TrendingDown, TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Campaign } from "../types";
import { formatCurrency, formatROI, getLucroColor, getROIColor } from "../campaigns/formatters";

interface KpiData {
  totalInvestment: number;
  totalCommission: number;
  totalLucro: number;
  globalROI: number;
}

function computeKpis(campaigns: Campaign[]): KpiData {
  const totalInvestment = campaigns.reduce((acc, c) => acc + (c.investment ?? 0), 0);
  const totalCommission = campaigns.reduce((acc, c) => acc + (c.commission ?? 0), 0);
  const totalLucro = totalCommission - totalInvestment;
  const globalROI = totalInvestment > 0 ? (totalLucro / totalInvestment) * 100 : 0;
  return { totalInvestment, totalCommission, totalLucro, globalROI };
}

interface Props {
  campaigns: Campaign[];
  isPending: boolean;
}

export const DashboardKpiCards = memo(({ campaigns, isPending }: Props) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { totalInvestment, totalCommission, totalLucro, globalROI } = computeKpis(campaigns);

  const cards = [
    {
      label: "Investimento Total",
      value: formatCurrency(totalInvestment),
      sub: "Soma de todos os cachês",
      icon: DollarSign,
      colorClass: "text-foreground",
      iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Comissão Total",
      value: formatCurrency(totalCommission),
      sub: "Comissões recebidas",
      icon: TrendingUp,
      colorClass: "text-foreground",
      iconBg: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
    },
    {
      label: "Lucro Total",
      value: formatCurrency(totalLucro),
      sub: "Comissão − Investimento",
      icon: totalLucro >= 0 ? TrendingUp : TrendingDown,
      colorClass: getLucroColor(totalLucro),
      iconBg:
        totalLucro >= 0
          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
    },
    {
      label: "ROI Global",
      value: formatROI(globalROI),
      sub: "(Lucro / Investimento) × 100",
      icon: BarChart2,
      colorClass: getROIColor(globalROI),
      iconBg:
        globalROI >= 0
          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${card.colorClass} truncate`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{card.sub}</p>
                </div>
                <div className={`flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full ${card.iconBg}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

DashboardKpiCards.displayName = "DashboardKpiCards";
