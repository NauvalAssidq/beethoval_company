import { LocalizedString } from "./i18n";

export interface Faq {
  _id: string;
  question: LocalizedString;
  answer: LocalizedString;
  order: number;
}
