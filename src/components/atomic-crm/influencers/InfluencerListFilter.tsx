import { Filter } from "lucide-react";
import { FilterLiveForm } from "ra-core";
import { SearchInput } from "@/components/admin/search-input";
import { ToggleFilterButton } from "@/components/admin/toggle-filter-button";
import { FilterCategory } from "../filters/FilterCategory";
import { INFLUENCER_FILTER_STATUS_OPTIONS, getStatusBadgeStyle } from "./formatters";
import { Badge } from "@/components/ui/badge";

export const InfluencerListFilter = () => {
  return (
    <div className="w-56 min-w-56 order-first pt-0.5 flex flex-col gap-4">
      <FilterLiveForm>
        <SearchInput source="q" placeholder="Buscar por nome, @instagram..." />
      </FilterLiveForm>

      <FilterCategory label="Filtrar por Status" icon={<Filter className="w-4 h-4" />}>
        {INFLUENCER_FILTER_STATUS_OPTIONS.map((status) => (
          <ToggleFilterButton
            key={status.id}
            className="w-full justify-between"
            label={
              <div className="flex items-center justify-between w-full">
                <span>{status.name}</span>
                <Badge className={`text-[10px] px-1.5 py-0.5 ${getStatusBadgeStyle(status.id)}`}>
                  •
                </Badge>
              </div>
            }
            value={{ status: status.id }}
          />
        ))}
      </FilterCategory>
    </div>
  );
};
