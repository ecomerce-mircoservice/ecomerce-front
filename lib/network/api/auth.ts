"use server";

import { createApiResource } from "../utils/base";
import type { LoginDTO, RegisterDTO, AuthResponse, LogoutResponse } from "@/lib/types/entities/auth";
import { getCookieStore } from "../utils/cookies/utils";

// Create the Auth A PI resource
const authApi = createApiResource<AuthResponse, LoginDTO, RegisterDTO>("auth");

// Authentication methods
export async function login(credentials: LoginDTO) {
  // The fetchData function in main.ts already handles token storage
  return await authApi.postResource<AuthResponse, LoginDTO>("login", credentials);
}

export async function register(data: RegisterDTO) {
  // The fetchData function in main.ts already handles token storage
  return await authApi.postResource<AuthResponse, RegisterDTO>("register", data);
}

export async function logout() {
  const response = await authApi.postResource<LogoutResponse, {}>("logout", {});
  
  // Clear cookies
  const cookieStore = await getCookieStore();
  cookieStore.delete("token");
  cookieStore.delete("userType");
  
  return response;
}

export async function getCurrentUser() {
  return await authApi.getResource<AuthResponse["user"]>("me");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await getCookieStore();
  const token = cookieStore.get("token");
  return !!token;
}

export async function refreshToken() {
  return await authApi.postResource<{ token: string }, {}>("refresh-token", {});
}
