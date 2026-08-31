export type LanguageOption = {
  code: string;
  flag: string;
  name: string;
};

export const commonLanguageOptions: readonly LanguageOption[] = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Spanish" },
  { code: "fr", flag: "🇫🇷", name: "French" },
  { code: "de", flag: "🇩🇪", name: "German" },
  { code: "it", flag: "🇮🇹", name: "Italian" },
  { code: "pt", flag: "🇵🇹", name: "Portuguese" },
  { code: "uk", flag: "🇺🇦", name: "Ukrainian" },
  { code: "pl", flag: "🇵🇱", name: "Polish" },
  { code: "nl", flag: "🇳🇱", name: "Dutch" },
  { code: "sv", flag: "🇸🇪", name: "Swedish" },
  { code: "tr", flag: "🇹🇷", name: "Turkish" },
  { code: "ar", flag: "🇸🇦", name: "Arabic" },
  { code: "hi", flag: "🇮🇳", name: "Hindi" },
  { code: "ja", flag: "🇯🇵", name: "Japanese" },
  { code: "ko", flag: "🇰🇷", name: "Korean" },
  { code: "zh", flag: "🇨🇳", name: "Chinese" },
] as const;

export function formatLanguageCode(code: string): string {
  const option = commonLanguageOptions.find((item) => item.code === code);

  return option ? `${option.flag} ${option.name}` : code;
}
