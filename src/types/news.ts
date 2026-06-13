import { LocalizedString } from "./i18n";

export interface NewsArticle {
  _id?: string;
  title: LocalizedString;
  slug: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  coverImage: string;
  tags: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface NewsResponse {
  news: NewsArticle[];
  total: number;
  page: number;
  totalPages: number;
}
