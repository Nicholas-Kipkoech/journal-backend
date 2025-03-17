import { Request } from "express";

export interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
