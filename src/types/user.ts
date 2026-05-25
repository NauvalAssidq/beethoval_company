export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}
