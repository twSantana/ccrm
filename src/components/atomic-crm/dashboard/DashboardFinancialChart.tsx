import { memo, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Campaign } from "../types";
import { calculateLucro } from "../types";

interface Props {
  campaigns: Campaign[];
  isPending: boolean;
}

// Truncate campaign name for chart label
const truncate = (str: string, n = 16) =>
  str.length > n ? str.slice(0, n - 1) + "…" : str;

export const DashboardFinancialChart = memo(({ campaigns, isPending }: Props) => {
  const chartData = useMemo(() => {
    if (!campaigns.length) return [];
    // Sort by created_at desc, take up to 10
    const sorted = [...campaigns]
      .sort((a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      )
      .slice(0, 10)
      .reverse(); // oldest first so chart reads left→right chronologically

    return sorted.map((c) => {
      const lucro = calculateLucro(c.commission ?? 0, c.investment ?? 0);
      return {
        campanha: truncate(c.name),
        Investimento: c.investment ?? 0,
        Comissão: c.commission ?? 0,
        Lucro: lucro,
      };
    });
  }, [campaigns]);

  if (isPending) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!chartData.length) return null;

  const formatBRL = (v: number) => {
    if (Math.abs(v) >= 1000) return `R$${(v / 1000).toFixed(0)}k`;
    return `R$${v.toFixed(0)}`;
  };

  return (
    <div className="h-[320px] w-full">
      <ResponsiveBar
        data={chartData}
        indexBy="campanha"
        keys={["Investimento", "Comissão", "Lucro"]}
        colors={["#6366f1", "#8b5cf6", "#10b981"]}
        groupMode="grouped"
        margin={{ top: 20, right: 20, bottom: 70, left: 60 }}
        padding={0.25}
        innerPadding={2}
        borderRadius={3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        enableGridX={false}
        enableGridY={true}
        enableLabel={false}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: -30,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          format: formatBRL,
        }}
        tooltip={({ id, value, indexValue }) => (
          <div className="px-3 py-2 bg-background border border-border rounded shadow text-sm text-foreground">
            <strong>{indexValue}</strong>
            <br />
            {id}:{" "}
            <span className="font-semibold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                value
              )}
            </span>
          </div>
        )}
        theme={{
          text: { fill: "var(--color-muted-foreground)", fontSize: 11 },
          grid: { line: { stroke: "var(--color-border)", strokeOpacity: 0.5 } },
          tooltip: { container: { background: "transparent", boxShadow: "none", padding: 0 } },
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom",
            direction: "row",
            translateY: 65,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: "var(--color-muted-foreground)",
            symbolSize: 10,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
});

DashboardFinancialChart.displayName = "DashboardFinancialChart";
