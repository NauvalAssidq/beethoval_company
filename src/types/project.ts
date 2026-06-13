import { LocalizedString } from "./i18n";

export interface Project {
  _id?: string;
  title: LocalizedString;
  slug: LocalizedString;
  description: LocalizedString;
  content: LocalizedString;
  coverImage: string;
  marqueeImage?: string;
  techStack: string[];
  createdAt: Date;
  updatedAt: Date;
  order?: number;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}