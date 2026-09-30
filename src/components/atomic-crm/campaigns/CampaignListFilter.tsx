import { useListFilterContext } from "ra-core";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CAMPAIGN_STAGE_OPTIONS } from "./formatters";

export const CampaignListFilter = () => {
  const { filterValues, setFilters } = useListFilterContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filterValues, q: e.target.value || undefined }, filterValues);
  };

  const handleStage = (value: string) => {
    if (value === "__all__") {
      const { stage: _stage, ...rest } = filterValues;
      setFilters(rest, filterValues);
    } else {
      setFilters({ ...filterValues, stage: value }, filterValues);
    }
  };

  const hasActiveFilters = filterValues.q || filterValues.stage;

  const handleClear = () => {
    setFilters({}, filterValues);
  };

  return (
    <div className="w-full md:w-64 shrink-0 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaign-search" className="text-xs text-muted-foreground">
          Buscar campanha
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="campaign-search"
            placeholder="Nome, infoproduto..."
            className="pl-8"
            value={filterValues.q ?? ""}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Estágio</Label>
        <Select
          value={filterValues.stage ?? "__all__"}
          onValueChange={handleStage}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os estágios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos</SelectItem>
            {CAMPAIGN_STAGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
