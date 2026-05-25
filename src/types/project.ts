export interface Project {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string;
  marqueeImages: string[];
  techStack: string[];
  createdAt: Date;
  updatedAt: Date;
}