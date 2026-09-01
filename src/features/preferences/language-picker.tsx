"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { languageCodeSchema } from "@/domain/languages/language-code";
import { commonLanguageOptions } from "@/domain/languages/language-options";

type LanguagePickerProps = {
  description: string;
  id: string;
  initialValue: string[];
  label: string;
  name: string;
};

export function LanguagePicker({
  description,
  id,
  initialValue,
  label,
  name,
}: LanguagePickerProps) {
  const [query, setQuery] = useState("");
  const [customLanguageCodes, setCustomLanguageCodes] = useState<string[]>([]);
  const descriptionId = `${id}-description`;
  const normalizedQuery = query.trim().toLowerCase();
  const languages = useMemo(
    () =>
      commonLanguageOptions.filter((language) =>
        `${language.name} ${language.code}`.toLowerCase().includes(normalizedQuery),
      ),
    [normalizedQuery],
  );
  const customCodeResult = languageCodeSchema.safeParse(query);
  const customCode = customCodeResult.success ? customCodeResult.data : null;
  const canAddCustomCode =
    customCode !== null &&
    !commonLanguageOptions.some((language) => language.code === customCode) &&
    !customLanguageCodes.includes(customCode);

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{label}</legend>
      <p id={descriptionId} className="text-sm text-muted-foreground">
        {description}
      </p>
      <div className="space-y-2">
        <Label htmlFor={id} className="sr-only">
          Search {label.toLowerCase()}
        </Label>
        <Input
          id={id}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search languages or enter an ISO code"
          aria-describedby={descriptionId}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>
      <div
        aria-label={`${label} options`}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {languages.map((language) => (
          <label
            key={language.code}
            className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-primary/60 has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-2 has-focus-visible:ring-ring"
          >
            <input
              type="checkbox"
              name={name}
              value={language.code}
              defaultChecked={initialValue.includes(language.code)}
              className="sr-only"
            />
              <span className="text-base" aria-hidden="true">
                {language.flag}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">
                {language.name}
              </span>
              <span className="text-xs text-muted-foreground">{language.code}</span>
          </label>
        ))}
        {canAddCustomCode ? (
          <button
            type="button"
            onClick={() => setCustomLanguageCodes((current) => [...current, customCode])}
            className="col-span-full flex items-center gap-2 rounded-lg border border-dashed bg-background px-3 py-2 text-left text-sm hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium">Add {customCode}</span>
            <span className="text-muted-foreground">Custom ISO language code</span>
          </button>
        ) : null}
        {customLanguageCodes.map((languageCode) => (
          <label
            key={languageCode}
            className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2 text-left text-sm has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-2 has-focus-visible:ring-ring"
          >
            <input
              type="checkbox"
              name={name}
              value={languageCode}
              defaultChecked
              className="sr-only"
            />
            <span className="min-w-0 flex-1 truncate font-medium">
              {languageCode}
            </span>
            <span className="text-xs text-muted-foreground">Custom</span>
          </label>
        ))}
      </div>
      {languages.length === 0 && !canAddCustomCode ? (
        <p className="text-sm text-muted-foreground">
          No common language matches. Enter a valid ISO code such as pt-BR.
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">
        Select as many languages as you need. Use Space to select a focused card.
      </p>
    </fieldset>
  );
}
