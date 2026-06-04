export interface Project {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string;
  marqueeImage?: string;
  techStack: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}