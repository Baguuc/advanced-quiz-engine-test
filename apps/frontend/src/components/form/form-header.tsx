import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx";
import { FormCard } from "@/components/form/form-card.tsx";

interface FormHeaderProps {
  title: string;
  description?: string | null;
}

export const FormHeader = ({ title, description }: FormHeaderProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const shortDescription = description?.slice(0, 150).trim() ?? "";
  const isLongDescription = (description?.length ?? 0) > 150;

  return (
    <FormCard>
      <AspectRatio ratio={4} className="mb-2">
        <img
          src="https://media1.tenor.com/m/elDI7mjDFeoAAAAC/dumb-patrick-patrick-star.gif"
          className="w-full h-full object-fill rounded-lg"
          alt="Form banner"
        />
      </AspectRatio>
      <h1 className="font-bold text-5xl mb-2">{title}</h1>
      {description && (
        <Collapsible open={isDescriptionExpanded} onOpenChange={setIsDescriptionExpanded}>
          <p className="text-gray-600 dark:text-gray-400 text-justify whitespace-pre-wrap">
            {isDescriptionExpanded || !isLongDescription ? description : `${shortDescription} ...`}
          </p>
          {isLongDescription && (
            <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
              {isDescriptionExpanded ? "Pokaż mniej" : "Pokaż więcej"}
            </CollapsibleTrigger>
          )}
        </Collapsible>
      )}
    </FormCard>
  );
};
