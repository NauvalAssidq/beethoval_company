import { LocalizedString } from "./i18n";

export interface Service {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon?: string;
  image?: string;
  languages?: string[];
  order: number;
}
