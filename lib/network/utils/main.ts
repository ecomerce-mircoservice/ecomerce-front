"use server";
import { serverAddress } from "@/lib/config/main";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  LockedError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "@/lib/errors/main";
import { getCookieStore } from "./cookies/utils";
import { headers } from "next/headers";
import { logger } from "@/lib/utils/logger";

// Helper function to determine if we're in a secure context
function isSecureContext() {
  // Only use secure cookies in production AND when using HTTPS
  return (
    process.env.NODE_ENV === "production" &&
    (serverAddress.startsWith("https://") ||
      process.env.FORCE_SECURE_COOKIES === "true")
  );
}

// Helper function to get user agent and IP address
async function getDeviceInfo() {
  const headersList = await headers();

  // Get IP address from headers (in order of preference)
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const clientIp = headersList.get("x-client-ip");
  const remoteAddr = headersList.get("x-remote-addr");

  let ipAddress = "127.0.0.1"; // Default fallback

  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first (original client)
    ipAddress = forwarded.split(",")[0].trim();
  } else if (realIp) {
    ipAddress = realIp;
  } else if (clientIp) {
    ipAddress = clientIp;
  } else if (remoteAddr) {
    ipAddress = remoteAddr;
  }

  // Convert IPv6 loopback to IPv4 for consistency
  if (ipAddress === "::1") {
    ipAddress = "127.0.0.1";
  }

  const userAgent = headersList.get("user-agent") || "";

  return {
    ip_address: ipAddress,
    user_agent: userAgent,
  };
}

// Helper function for file downloads
export async function downloadFile(
  input: RequestInfo,
  init?: RequestInit
): Promise<Blob> {
  const result = await fetchData<Blob>(input, init, {
    responseType: "blob",
    expectFile: true,
  });
  return result === true ? new Blob() : result;
}

// Helper function to download and save file
export async function downloadAndSaveFile(
  input: RequestInfo,
  filename?: string,
  init?: RequestInit
): Promise<void> {
  try {
    // Get device information
    const deviceInfo = await getDeviceInfo();

    const response = await fetch(serverAddress + input, {
      ...init,
      credentials: "include",
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${(await getCookieStore()).get("token")?.value}`,
        "User-Agent": deviceInfo.user_agent,
        "X-Forwarded-For": deviceInfo.ip_address,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed with status: ${response.status}`);
    }

    const blob = await response.blob();

    // Extract filename from Content-Disposition header if not provided
    if (!filename) {
      const disposition = response.headers.get("content-disposition");
      if (disposition) {
        const filenameMatch = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        filename = filenameMatch
          ? filenameMatch[1].replace(/['"]/g, "")
          : "download";
      } else {
        filename = "download";
      }
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    logger.error({ error }, 'Download error');
    throw error;
  }
}

export async function fetchData<T>(
  input: RequestInfo,
  init?: RequestInit,
  options?: {
    responseType?: "json" | "blob" | "text" | "stream";
    expectFile?: boolean;
    retry?: boolean;
  }
): Promise<T | true> {
  const {
    responseType = "json",
    expectFile = false,
    retry = false,
  } = options || {};

  if (!init) init = {};

  if (!init.headers) {
    init.headers = {};
  }

  // Set default headers
  init.headers = {
    ...init.headers,
    Accept: expectFile ? "*/*" : "application/json",
  };

  // Only set Content-Type to application/json if the body is not FormData
  if (!(init.body instanceof FormData)) {
    init.headers = {
      ...init.headers,
      "Content-Type": "application/json",
    };
  }
  init.credentials = "include";

  // Get device information and add to headers
  const deviceInfo = await getDeviceInfo();
  init.headers = {
    ...init.headers,
    "User-Agent": deviceInfo.user_agent,
    "X-Forwarded-For": deviceInfo.ip_address,
  };
  // Retrieve the cookie store
  const cookieStore = await getCookieStore();

  // 🔐 Fetch the token from cookies
  const token = cookieStore.get("token")?.value;

  // Debug: Log cookie information
  // if (process.env.NODE_ENV === "development") {
  //   console.log("🍪 Cookie Debug:", {
  //     hasToken: !!token,
  //     tokenLength: token?.length || 0,
  //     allCookies: cookieStore.getAll(),
  //     requestUrl: serverAddress + input,
  //   });
  // }

  if (token) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Add timeout to prevent indefinite blocking
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const response = await fetch(serverAddress + input, {
      ...init,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

  // Determine if this is a file response based on Content-Type
  const contentType = response.headers.get("content-type") || "";
  const isFileResponse =
    expectFile ||
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream") ||
    contentType.includes("image/") ||
    contentType.includes("video/") ||
    contentType.includes("audio/") ||
    (contentType.startsWith("application/") && !contentType.includes("json"));

  // Log the response for debugging (but not for file responses)
  if (process.env.NODE_ENV === "development") {
    const jsonResponse = await response.clone().text();
    if (!isFileResponse) {
      logger.info({
        url: serverAddress + input,
        method: init.method || "GET",
        status: response.status,
        response: jsonResponse,
      }, 'API Request');
    } else {
      logger.info({
        url: serverAddress + input,
        method: init.method || "GET",
        contentType,
        status: response.status,
      }, 'File Request');
    }
  }
  if (
    response.ok &&
    typeof input === "string" &&
    (input.includes("/api/v1/auth/login") ||
      input.includes("/api/v1/auth/register") ||
      input.includes("/api/v1/auth/refresh-token"))
  ) {
    const responseBody = await response.clone().json();

    // ✅ Extract and store the token manually from microservices API response
    const token = responseBody?.data?.token;
    const userRoles = responseBody?.data?.user?.roles;
    if (token) {
      cookieStore.set("token", token, {
        path: "/",
        httpOnly: false, // this can be true if only server-side access is needed
        secure: isSecureContext(), // Dynamic based on environment and protocol
        sameSite: "lax",
        domain: undefined, // Don't set domain to allow cookies on any host
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      cookieStore.delete("token");
    }
    if (userRoles) {
      cookieStore.set("userType", userRoles, {
        path: "/",
        httpOnly: false,
        secure: isSecureContext(), // Dynamic based on environment and protocol
        sameSite: "lax",
        domain: undefined, // Don't set domain to allow cookies on any host
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      cookieStore.delete("userType");
    }
  }

  if (response.status === 204 && init.method === "DELETE") {
    return true;
  }

  if (response.ok) {
    // Handle different response types
    if (isFileResponse || responseType === "blob") {
      const blob = await response.blob();
      return blob as unknown as T;
    } else if (responseType === "text") {
      const text = await response.text();
      return text as unknown as T;
    } else if (responseType === "stream") {
      return response as unknown as T;
    } else {
      // Default JSON response
      // Check if response has content before parsing
      const text = await response.text();
      if (!text || text.trim() === "") {
        logger.warn({ url: serverAddress + input }, 'Empty response received');
        return [] as unknown as T; // Return empty array for empty responses
      }
      try {
        const responseBody = JSON.parse(text);
        return responseBody as Promise<T>;
      } catch (parseError) {
        logger.error({ parseError, responseText: text }, 'JSON parse error');
        throw new Error(
          `Failed to parse JSON response: ${
            parseError instanceof Error ? parseError.message : "Unknown error"
          }`
        );
      }
    }
  } else {
    // For error responses, try to parse as JSON, but fallback to text if it fails
    let errorBody;
    let errorMessage: string;

    try {
      errorBody = await response.json();

      // First, check if there's a direct message field (from your backend)
      if (errorBody.message) {
        errorMessage = errorBody.message;
      }
      // Then check for errors array
      else if (Array.isArray(errorBody.errors)) {
        errorMessage = errorBody.errors[0] || "An error occurred";
      }
      // Finally check for errors object
      else if (errorBody.errors && typeof errorBody.errors === "object") {
        const errorErrors = Object.values(errorBody.errors)[0];
        if (typeof errorErrors === "string") {
          errorMessage = errorErrors;
        } else {
          errorMessage = (errorErrors as string[])?.[0] || "An error occurred";
        }
      }
      // Fallback to generic message
      else {
        errorMessage = "An error occurred";
      }

      if (errorMessage.startsWith("SQLSTATE[")) {
        errorMessage = "value error, try another thing";
      }
    } catch (jsonError) {
      // If JSON parsing fails, try to get text
      try {
        const errorText = await response.text();
        errorMessage =
          errorText || `Request failed with status: ${response.status}`;
      } catch (textError) {
        errorMessage = `Request failed with status: ${response.status}`;
      }
    }

    switch (response.status) {
      case 401:
        // Clear the token cookie if unauthorized
        throw new UnauthorizedError(errorMessage);
      case 409:
        throw new ConflictError(errorMessage);
      case 400:
        throw new BadRequestError(errorMessage);
      case 403:
        throw new ForbiddenError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 422:
        throw new UnprocessableEntityError(errorMessage);
      case 423:
        throw new LockedError(errorMessage);
      case 500:
        throw new InternalServerError(errorMessage);
      default:
        throw new Error(
          `Request failed with status: ${response.status} message: ${errorMessage}`
        );
    }
  }
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      logger.error({ url: serverAddress + input, error }, 'Request timeout');
      throw new Error('Request timeout - the server took too long to respond. Please try again.');
    }
    
    // Re-throw other errors
    throw error;
  }
}

/**
 * Usage Examples:
 *
 *
 * //  Download a file
 * const blob = await downloadFile('/download/document.pdf');
 *
 * //  Download and auto-save file
 * await downloadAndSaveFile('/download/document.pdf', 'my-document.pdf');
 *
 * //  Fetch JSON data (normal usage)
 * const data = await fetchData<UserData>('/api/user');
 */
