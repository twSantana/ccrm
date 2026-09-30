export const formatFollowers = (count?: number | null): string => {
  if (count === null || count === undefined || isNaN(Number(count))) return "-";
  const num = Number(count);
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(1).replace(".", ",");
    return `${formatted.endsWith(",0") ? formatted.slice(0, -2) : formatted} mi`;
  }
  if (num >= 1_000) {
    const formatted = (num / 1_000).toFixed(1).replace(".", ",");
    return `${formatted.endsWith(",0") ? formatted.slice(0, -2) : formatted} mil`;
  }
  return num.toLocaleString("pt-BR");
};

export const formatFemaleAudience = (pct?: number | null): string => {
  if (pct === null || pct === undefined || isNaN(Number(pct))) return "-";
  return `${Number(pct)}%`;
};

export const INFLUENCER_STATUS_OPTIONS = [
  { id: "Prospectada", name: "Prospectada" },
  { id: "Contatada", name: "Contatada" },
  { id: "Respondeu", name: "Respondeu" },
  { id: "Negociação", name: "Negociação" },
  { id: "Aprovada", name: "Aprovada" },
  { id: "Campanha ativa", name: "Campanha ativa" },
  { id: "Finalizada", name: "Finalizada" },
  { id: "Descartada", name: "Descartada" },
];

export const INFLUENCER_FILTER_STATUS_OPTIONS = [
  { id: "Prospectada", name: "Prospectada" },
  { id: "Contatada", name: "Contatada" },
  { id: "Respondeu", name: "Respondeu" },
  { id: "Negociação", name: "Negociação" },
  { id: "Aprovada", name: "Aprovada" },
];

export const getStatusBadgeStyle = (status?: string) => {
  switch (status) {
    case "Prospectada":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Contatada":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Respondeu":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "Negociação":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    case "Aprovada":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Campanha ativa":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800";
    case "Finalizada":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    case "Descartada":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
};
