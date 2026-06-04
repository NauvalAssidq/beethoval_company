export interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  languages?: string[];
  order: number;
}
