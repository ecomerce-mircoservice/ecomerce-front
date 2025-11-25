"use server";

import { createApiResource } from "../utils/base";
import type { User, CreateUserDTO, UpdateUserDTO, UserResponse } from "@/lib/types/entities/user";

// Create the Users API resource
export const usersApi = createApiResource<User, CreateUserDTO, UpdateUserDTO>("users");

// Additional user-specific methods can be added here
export async function getAllUsers(): Promise<User[]> {
  return await usersApi.list();
}

export async function getUserById(id: string): Promise<User> {
  return await usersApi.get(id);
}

export async function createUser(data: CreateUserDTO) {
  return await usersApi.create(data);
}

export async function updateUser(id: string, data: UpdateUserDTO) {
  return await usersApi.update(id, data);
}

export async function deleteUser(id: string) {
  return await usersApi.delete(id);
}
