import { minValue, number, required } from "ra-core";
import { NumberInput } from "@/components/admin/number-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { CAMPAIGN_STAGE_OPTIONS } from "./formatters";

const validateName = [required("Nome da campanha é obrigatório")];
const validateStage = [required("Estágio é obrigatório")];
const validateCurrency = [number("Deve ser um valor numérico"), minValue(0, "Mínimo R$ 0")];

export const CampaignInputs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">
          Informações da Campanha
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            source="name"
            label="Nome da Campanha *"
            validate={validateName}
            isRequired
            helperText="Ex: Lançamento Infoproduto X - Março/2025"
          />
          <ReferenceInput source="influencer_id" reference="influencers">
            <AutocompleteInput
              label="Influenciadora *"
              optionText="name"
              validate={[required("Selecione uma influenciadora")]}
              isRequired
            />
          </ReferenceInput>
          <TextInput
            source="infoproduct_name"
            label="Infoproduto"
            placeholder="Nome do produto divulgado"
          />
          <SelectInput
            source="stage"
            label="Estágio *"
            choices={CAMPAIGN_STAGE_OPTIONS}
            defaultValue="Negociação"
            validate={validateStage}
            isRequired
          />
        </div>
      </div>

      <hr className="border-border" />

      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">
          Período
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput source="start_date" label="Data de Início" type="date" />
          <TextInput source="end_date" label="Data de Término" type="date" />
        </div>
      </div>

      <hr className="border-border" />

      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">
          Financeiro
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Lucro = Comissão − Investimento &nbsp;|&nbsp; ROI = (Lucro / Investimento) × 100
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NumberInput
            source="investment"
            label="Investimento (R$)"
            validate={validateCurrency}
            placeholder="0.00"
            helperText="Cachê pago à influenciadora"
          />
          <NumberInput
            source="gross_sales"
            label="Vendas Brutas (R$)"
            validate={validateCurrency}
            placeholder="0.00"
            helperText="Total gerado em vendas"
          />
          <NumberInput
            source="commission"
            label="Comissão Recebida (R$)"
            validate={validateCurrency}
            placeholder="0.00"
            helperText="Comissão da plataforma"
          />
        </div>
      </div>

      <hr className="border-border" />

      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">
          Observações
        </h3>
        <TextInput
          source="notes"
          label="Observações"
          multiline
          rows={4}
          placeholder="Detalhes da negociação, condições, links de divulgação..."
        />
      </div>
    </div>
  );
};
