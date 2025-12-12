"use server";

import { createApiResource } from "../utils/base";
import type {
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  LogoutResponse,
  User,
} from "@/lib/types/entities/auth";
import { getCookieStore } from "../utils/cookies/utils";
import { ApiResponse } from "@/lib/types/subTypes/commonTypes";

// Create the Auth API resource - base path is /api/v1/auth
const authApi = createApiResource<AuthResponse, LoginDTO, RegisterDTO>(
  "api/v1/auth"
);

export async function login(
  credentials: LoginDTO
): Promise<ApiResponse<AuthResponse>> {
  // POST /api/v1/auth/login
  const response = await authApi.postResource<AuthResponse, LoginDTO>(
    "login",
    credentials
  );

  // 💡 FIX: Set the token cookie upon successful login
  if (response.success && response.data?.token) {
    const cookieStore = await getCookieStore();
    
    // Check for expiration in the response if provided, otherwise set a max age.
    // Assuming the token is valid for 1 hour (3600 seconds)
    const expirationSeconds = 3600; 

    cookieStore.set("token", response.data.token, {
      httpOnly: true, // IMPORTANT for security
      secure: process.env.NODE_ENV === "production",
      maxAge: expirationSeconds, 
      path: "/",
    });
  }

  return response;
}

export async function register(
  data: RegisterDTO
): Promise<ApiResponse<AuthResponse>> {
  // POST /api/v1/auth/register
  return await authApi.postResource<AuthResponse, RegisterDTO>(
    "register",
    data
  );
}

export async function logout() {
  // Clear cookies locally (no logout endpoint in API)
  const cookieStore = await getCookieStore();
  cookieStore.delete("token");
  cookieStore.delete("userType");

  return { success: true, message: "Logged out successfully" };
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // GET /api/v1/auth/me
    return await authApi.getResource<User>("me");
  } catch (error) {
    // Return null if user is not authenticated or token is invalid
    return null;
  }
}

export async function validateAdminAccess(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.roles.includes("ROLE_ADMIN") || false;
  } catch (error) {
    return false;
  }
}


export async function refreshToken(): Promise<ApiResponse<{ token: string }>> {
  // POST /api/v1/auth/refresh-token
  return await authApi.postResource<{ token: string }, {}>("refresh-token", {});
}
