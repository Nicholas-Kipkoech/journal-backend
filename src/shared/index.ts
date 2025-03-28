import { Request } from "express";

export interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CollectionDto {
  name: string;
  description?: string;
}

export interface JournalDto {
  title: string;
  content: string;
  collectionId?: string;
}
