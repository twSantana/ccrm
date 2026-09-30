export const CAMPAIGN_STAGE_OPTIONS = [
  { id: "Negociação", name: "Negociação" },
  { id: "Aprovada", name: "Aprovada" },
  { id: "Campanha ativa", name: "Campanha ativa" },
  { id: "Finalizada", name: "Finalizada" },
  { id: "Cancelada", name: "Cancelada" },
];

export const getStageBadgeStyle = (stage?: string) => {
  switch (stage) {
    case "Negociação":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    case "Aprovada":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Campanha ativa":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800";
    case "Finalizada":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    case "Cancelada":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
};

export const formatCurrency = (value?: number | null): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return "R$ -";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

export const formatROI = (roi?: number | null): string => {
  if (roi === null || roi === undefined || isNaN(Number(roi))) return "-";
  const num = Number(roi);
  return `${num >= 0 ? "+" : ""}${num.toFixed(1).replace(".", ",")}%`;
};

export const getROIColor = (roi?: number | null): string => {
  if (roi === null || roi === undefined || isNaN(Number(roi))) return "";
  return Number(roi) >= 0
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
};

export const getLucroColor = (lucro?: number | null): string => {
  if (lucro === null || lucro === undefined || isNaN(Number(lucro))) return "";
  return Number(lucro) >= 0
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
};
