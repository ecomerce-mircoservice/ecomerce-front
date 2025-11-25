// User Entity Types

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// DTOs for User operations
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: "user" | "admin";
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}
