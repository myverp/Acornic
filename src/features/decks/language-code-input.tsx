import { commonLanguageOptions } from "@/domain/languages/language-options";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LanguageCodeInputProps = {
  defaultValue?: string;
  id: string;
  label: string;
  name: string;
};

export function LanguageCodeInput({
  defaultValue,
  id,
  label,
  name,
}: LanguageCodeInputProps) {
  const descriptionId = `${id}-description`;
  const listId = `${id}-options`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder="en"
        list={listId}
        aria-describedby={descriptionId}
        autoCapitalize="none"
        autoComplete="off"
        spellCheck={false}
        required
      />
      <datalist id={listId}>
        {commonLanguageOptions.map((language) => (
          <option
            key={language.code}
            value={language.code}
            label={`${language.flag} ${language.name}`}
          />
        ))}
      </datalist>
      <p id={descriptionId} className="text-xs text-muted-foreground">
        Choose a common language below, or enter any valid code such as pt-BR.
      </p>
      <details className="text-xs text-muted-foreground">
        <summary className="w-fit cursor-pointer rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          View common languages with flags
        </summary>
        <ul
          aria-label="Common languages"
          className="mt-2 flex flex-wrap gap-x-2 gap-y-1"
        >
          {commonLanguageOptions.map((language) => (
            <li key={language.code}>
              <span aria-hidden="true">{language.flag}</span> {language.name}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
