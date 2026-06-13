export interface LocalizedString {
  en: string;
  id: string;
}

export function resolveTranslation(
  localizedField: LocalizedString | string | undefined | null,
  locale: string
): string {
  if (!localizedField) return "";
  if (typeof localizedField === "string") return localizedField;
  
  const target = localizedField[locale as keyof LocalizedString];
  if (target) return target;
  
  // Fallback logic as requested: "fallback language is the one that already filled"
  return localizedField.en || localizedField.id || "";
}
