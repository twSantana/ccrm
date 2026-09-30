import {
  maxValue,
  minValue,
  number,
  required,
} from "ra-core";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";
import { INFLUENCER_STATUS_OPTIONS } from "./formatters";
import { InfluencerTagsInput } from "./InfluencerTagsInput";
import { InfluencerOwnerInput } from "./InfluencerOwnerInput";

const validateName = [required("Nome é obrigatório")];
const validateFollowers = [number("Deve ser um número válido"), minValue(0, "Mínimo 0")];
const validateFemaleAudience = [
  number("Deve ser um número válido"),
  minValue(0, "Mínimo 0%"),
  maxValue(100, "Máximo 100%"),
];

export const InfluencerInputs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">
          Informações principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            source="name"
            label="Nome *"
            validate={validateName}
            isRequired
            helperText="Nome completo da influenciadora"
          />
          <SelectInput
            source="status"
            label="Status"
            choices={INFLUENCER_STATUS_OPTIONS}
            defaultValue="Prospectada"
          />
          <InfluencerOwnerInput />
          <InfluencerTagsInput />
          <TextInput
            source="handle_instagram"
            label="Instagram"
            placeholder="@usuario"
          />
          <TextInput
            source="handle_tiktok"
            label="TikTok"
            placeholder="@usuario"
          />
          <TextInput
            source="niche"
            label="Nicho"
            placeholder="Ex: Moda, Beleza, Fitness"
          />
          <NumberInput
            source="followers_count"
            label="Seguidores"
            validate={validateFollowers}
            placeholder="Ex: 125000"
          />
          <NumberInput
            source="female_audience_pct"
            label="Público feminino (%)"
            validate={validateFemaleAudience}
            placeholder="Ex: 87"
          />
        </div>
      </div>

      <hr className="border-border" />

      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">
          Contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput
            source="email"
            label="E-mail"
            type="email"
            placeholder="exemplo@email.com"
          />
          <TextInput
            source="phone"
            label="Telefone"
            placeholder="(11) 99999-9999"
          />
          <TextInput
            source="pix_key"
            label="Chave Pix"
            placeholder="CPF, e-mail ou chave aleatória"
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
          placeholder="Anotações internas sobre o público, preferências ou histórico..."
        />
      </div>
    </div>
  );
};
