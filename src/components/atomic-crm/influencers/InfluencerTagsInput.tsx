import { Plus } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AutocompleteArrayInput } from "@/components/admin/autocomplete-array-input";
import { ReferenceArrayInput } from "@/components/admin/reference-array-input";
import { Button } from "@/components/ui/button";

import { TagCreateModal } from "../tags/TagCreateModal";
import type { Influencer, Tag } from "../types";

export const InfluencerTagsInput = () => {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const { getValues, setValue } = useFormContext<Influencer>();

  const handleTagCreated = async (tag: Tag) => {
    const currentTags = getValues("tags") ?? [];
    setValue("tags", [...currentTags, tag.id], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsTagDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <ReferenceArrayInput
        source="tags"
        reference="tags"
        perPage={100}
        sort={{ field: "name", order: "ASC" }}
      >
        <AutocompleteArrayInput
          label="Tags"
          helperText="Selecione tags existentes ou crie uma nova."
          defaultValue={[]}
        />
      </ReferenceArrayInput>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsTagDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar tag
      </Button>
      <TagCreateModal
        open={isTagDialogOpen}
        onClose={() => setIsTagDialogOpen(false)}
        onSuccess={handleTagCreated}
      />
    </div>
  );
};
