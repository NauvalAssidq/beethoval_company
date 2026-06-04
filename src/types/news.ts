export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface NewsResponse {
  news: NewsArticle[];
  total: number;
  page: number;
  totalPages: number;
}
