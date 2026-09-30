import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { required, useGetIdentity } from "ra-core";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import type { Influencer, Sale } from "../types";

export const InfluencerOwnerInput = () => {
  const { identity } = useGetIdentity();
  const { getValues, setValue } = useFormContext<Influencer>();

  useEffect(() => {
    if (identity?.id != null && getValues("assigned_user_id") == null) {
      setValue("assigned_user_id", identity.id);
    }
  }, [getValues, identity?.id, setValue]);

  return (
    <ReferenceInput
      source="assigned_user_id"
      reference="sales"
      sort={{ field: "last_name", order: "ASC" }}
      filter={{ "disabled@neq": true }}
    >
      <SelectInput
        label="Responsável"
        helperText="Por padrão, quem cadastrou a influencer."
        validate={required()}
        optionText={(sale: Sale) =>
          `${sale.first_name} ${sale.last_name}`
        }
      />
    </ReferenceInput>
  );
};
