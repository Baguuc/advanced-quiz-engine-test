import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible.tsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx";
import { FormCard } from "@/components/form/form-card.tsx";
import { compareAsc, formatDistanceToNowStrict } from "date-fns";
import type { FormType } from "@/components/form/utils.ts";
import { pl } from "date-fns/locale";

interface FormHeaderProps {
  form: FormType;
}

function computeClosing(form: FormType): string | true | null {
  if (!form.closedAt) return null;

  if (compareAsc(form.closedAt, new Date()) <= 0) {
    return true;
  }

  return formatDistanceToNowStrict(form.closedAt, {
    locale: pl,
    addSuffix: true,
  });
}

export const FormHeader = ({ form }: FormHeaderProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [closing, setClosing] = useState<string | true | null>(() => computeClosing(form));

  const shortDescription = form.description?.slice(0, 150).trim() ?? "";
  const isLongDescription = (form.description?.length ?? 0) > 150;

  useEffect(() => {
    if (!form.closedAt) return;

    const interval = setInterval(() => {
      setClosing(computeClosing(form));
    }, 1000);

    return () => clearInterval(interval);
  }, [form, form.closedAt]);

  return (
    <FormCard className="grid gap-2">
      <AspectRatio ratio={4}>
        <img
          src="https://media1.tenor.com/m/elDI7mjDFeoAAAAC/dumb-patrick-patrick-star.gif"
          className="w-full h-full object-fill rounded-lg"
          alt="Form banner"
        />
      </AspectRatio>
      <h1 className="font-bold text-5xl">{form.title}</h1>
      {form.description && (
        <Collapsible open={isDescriptionExpanded} onOpenChange={setIsDescriptionExpanded}>
          <p className="text-gray-600 dark:text-gray-400 text-justify whitespace-pre-wrap">
            {isDescriptionExpanded || !isLongDescription ? form.description : `${shortDescription} ...`}
          </p>
          {isLongDescription && (
            <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
              {isDescriptionExpanded ? "Pokaż mniej" : "Pokaż więcej"}
            </CollapsibleTrigger>
          )}
        </Collapsible>
      )}
      {closing === true ? (
        <p className="text-sm text-red-400 mt-1">Formularz jest zamknięty</p>
      ) : (
        closing && <p className="text-sm text-amber-400 mt-1">Formularz zostanie zamknięty {closing}</p>
      )}
    </FormCard>
  );
};
