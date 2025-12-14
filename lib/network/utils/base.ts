import {
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types/subTypes/commonTypes";
import { ZodSchema } from "zod";
import { downloadFile, fetchData } from "./main";
import { handleAction } from "./action";
import { State } from "@/lib/schema/base";
import { logger } from "@/lib/utils/logger";

/**
 * Generic CRUD API client that can be extended for specific resources
 */
export class ApiResource<T, CreateDTO = T, UpdateDTO = Partial<T>> {
  private baseUrl: string;
  private haveFiles: boolean;

  constructor(resourcePath: string, haveFiles: boolean = false) {
    this.baseUrl = `/${resourcePath.replace(/^\/|\/$/g, "")}`; // Normalize path (no trailing slash)
    this.haveFiles = haveFiles;
  }
  /**
   * List all resources with pagination support
   */
  async list(): Promise<T[]> {
    try {
      const response = (await fetchData<ApiResponse<T[]>>(
        `${this.baseUrl}?paginated=false`,
        {
          method: "GET",
        }
      )) as ApiResponse<T[]>;
      return response.data;
    } catch (error) {
      logger.error({ error, method: 'list' }, 'Error fetching resource list');
      return [];
    }
  }

  /**
   * List all resources with pagination metadata
   * @returns The full paginated response including metadata
   */
  async listWithPagination<R = T>(
    page: number,
    limit: number,
    search: string = "",
    admin: boolean,
    paginated: boolean
  ): Promise<PaginatedResponse<R>> {
    try {
      const response = (await fetchData<PaginatedResponse<R>>(
        `${this.baseUrl}?page=${page}&limit=${limit}&search=${search}&admin=${admin}&paginated=${paginated}`,
        {
          method: "GET",
        }
      )) as PaginatedResponse<R>;
      return response;
    } catch (error) {
      logger.error({ error, method: 'listWithPagination', page, limit, search }, 'Error fetching paginated resources');
      return {
        data: [],
        success: false,
        code: 500,
        metadata: {
          pagination: {
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
        },
      };
    }
  }

  /**
   * Get a single resource by ID
   */
  async get(id: number | string): Promise<T> {
    try {
      const response = (await fetchData<ApiResponse<T>>(
        `${this.baseUrl}/${id}`,
        {
          method: "GET",
        }
      )) as ApiResponse<T>;
      return response.data as T;
    } catch (error) {
      logger.error({ error, method: 'get', id }, 'Error fetching resource by ID');
      return null as T; // Return null if not found
    }
  }

  /**
   * Create a new resource
   */
  async create(data: CreateDTO): Promise<ApiResponse<T>> {
    const body = this.haveFiles
      ? this.toFormData(data as Record<string, string | File>)
      : JSON.stringify(data);
    const response = (await fetchData<ApiResponse<T>>(this.baseUrl, {
      method: "POST",
      body,
    })) as ApiResponse<T>;
    return response;
  }

  /**
   * Update a resource
   */
  async update(
    id: number | string,
    data: UpdateDTO,
    fetchMethod: "PUT" | "POST" = "PUT"
  ): Promise<ApiResponse<T>> {
    const body = this.haveFiles
      ? this.toFormData(data as Record<string, string | File>)
      : JSON.stringify(data);
    const response = (await fetchData<ApiResponse<T>>(`${this.baseUrl}/${id}`, {
      method: fetchMethod,
      body,
    })) as ApiResponse<T>;
    return response;
  }

  /**
   * Delete a resource
   */
  async delete(id: number | string): Promise<ApiResponse<null>> {
    const response = (await fetchData<ApiResponse<null>>(
      `${this.baseUrl}/${id}`,
      {
        method: "DELETE",
      }
    )) as ApiResponse<null>;
    return response;
  }
  /**
   * Get all resources of a specific type with pagination support
   */
  async getAllResource<R>(resourcePath: string): Promise<R[]> {
    try {
      const normalizedPath = resourcePath.replace(/^\/|\/$/g, "");
      const url = normalizedPath ? `${this.baseUrl}/${normalizedPath}` : this.baseUrl;
      const response = (await fetchData<ApiResponse<R[]>>(
        `${url}?paginated=false`,
        {
          method: "GET",
        }
      )) as ApiResponse<R[]>;
      return response.data;
    } catch (error) {
      logger.error({ error, method: 'getAllResource', resourcePath }, 'Error fetching all resources');
      return [];
    }
  }
  /**
   * get all resources of a specific type with pagination metadata
   */
  async getAllResourcePaginated<R>(
    resourcePath: string,
    page: number,
    limit: number,
    search: string = "",
    paginated: boolean = true,
    admin: boolean = false
  ): Promise<PaginatedResponse<R>> {
    try {
      const normalizedPath = resourcePath.replace(/^\/|\/$/g, "");
      const url = normalizedPath ? `${this.baseUrl}/${normalizedPath}` : this.baseUrl;
      const response = (await fetchData<PaginatedResponse<R>>(
        `${url}?page=${page}&limit=${limit}&search=${search}&paginated=${paginated}&admin=${admin}`,
        {
          method: "GET",
        }
      )) as PaginatedResponse<R>;
      return response;
    } catch (error) {
      logger.error({ error, method: 'getAllResourcePaginated', resourcePath, page, limit, search }, 'Error fetching all resources');
      return {
        data: [],
        success: false,
        code: 500,
        metadata: {
          pagination: {
            page,
            pageSize: limit,
            totalItems: 0,
            totalPages: 0,
          },
        },
      };
    }
  }

  /**
   * Get a specific resource of a specific type
   */
  async getResource<R>(resourcePath: string): Promise<R> {
    try {
      const normalizedPath = resourcePath.replace(/^\/|\/$/g, "");
      const url = normalizedPath ? `${this.baseUrl}/${normalizedPath}` : this.baseUrl;
      const response = (await fetchData<ApiResponse<R>>(
        `${url}`,
        {
          method: "GET",
        }
      )) as ApiResponse<R>;
      return response.data as R;
    } catch (error) {
      logger.error({ error, method: 'getResource', resourcePath }, 'Error fetching resource');
      return null as R; // Return null if not found
    }
  }
  /**
   * Perform a Post request to a specific resource path
   */
  async postResource<T, U = Record<string, any>>(
    resourcePath: string,
    data: U
  ): Promise<ApiResponse<T>> {
    const body = this.haveFiles
      ? this.toFormData(data as Record<string, File>)
      : JSON.stringify(data);
    const normalizedPath = resourcePath.replace(/^\/|\/$/g, "");
    const url = normalizedPath ? `${this.baseUrl}/${normalizedPath}` : this.baseUrl;
    return (await fetchData<ApiResponse<T>>(
      `${url}`,
      {
        method: "POST",
        body,
      }
    )) as ApiResponse<T>;
  }
  /**
   * Perform a Delete request to a specific resource path
   */
  async deleteResource<T>(resourcePath: string): Promise<ApiResponse<T>> {
    const normalizedPath = resourcePath.replace(/^\/|\/$/g, "");
    const url = normalizedPath ? `${this.baseUrl}/${normalizedPath}` : this.baseUrl;
    return (await fetchData<ApiResponse<T>>(
      `${url}`,
      {
        method: "DELETE",
      }
    )) as ApiResponse<T>;
  }

  /**
   * Download a file from a specific resource path
   */
  async downloadFileResource(resourcePath: string): Promise<Blob> {
    const normalizedPath = resourcePath.replace(/^\/|\/$/g, "");
    const url = normalizedPath ? `${this.baseUrl}/${normalizedPath}` : this.baseUrl;
    const response = await downloadFile(`${url}`);
    return response;
  }
  /**
   * Server Action wrapper for fetching resources
   */
  private async handleAction(
    data: CreateDTO | UpdateDTO | Record<string, string | number | File>,
    schema: ZodSchema,
    action: () => Promise<ApiResponse<T | null>>,
    revalidatePaths?: string | string[] // New parameter
  ): Promise<State> {
    return handleAction<T, CreateDTO, UpdateDTO>(
      data,
      schema,
      action,
      revalidatePaths
    );
  }

  /**
   * Server Action wrapper for creating resources
   */
  createAction = async (
    prevState: State,
    formData: FormData | CreateDTO,
    schema: ZodSchema,
    applyTransform: boolean = true,
    revalidatePaths?: string | string[] // New parameter
  ): Promise<State> => {
    const data = applyTransform
      ? this.formDataToObject(formData as FormData)
      : formData;
    return await this.handleAction(
      data as CreateDTO,
      schema,
      () => this.create(data as CreateDTO),
      revalidatePaths
    );
  };

  /**
   * Server Action wrapper for updating resources
   */
  updateAction = async (
    prevState: State,
    formData: FormData | UpdateDTO,
    schema: ZodSchema,
    applyTransform: boolean = true,
    revalidatePaths?: string | string[], // New parameter
    idName: string = "id",
    fetchMethod: "PUT" | "POST" = "PUT"
  ): Promise<State> => {
    const rawId =
      formData instanceof FormData
        ? formData.get(idName)
        : (formData as { [key: string]: any })?.[idName];
    if (!rawId) {
      return {
        success: false,
        errors: { id: ["ID is required"] },
      };
    }

    // Convert ID to number if it's a string
    const id = typeof rawId === "string" ? Number(rawId) : rawId;

    const data = applyTransform
      ? this.formDataToObject(formData as FormData)
      : formData;

    // Put the ID back into the data object Number
    if (!(data instanceof FormData)) {
      (data as Record<string, any>)[idName] = id;
    }
    return await this.handleAction(
      data as UpdateDTO,
      schema,
      () => this.update(id, data as UpdateDTO, fetchMethod),
      revalidatePaths
    );
  };

  /**
   * Server Action wrapper for deleting resources
   */
  deleteAction = async (
    prevState: State,
    formData: FormData,
    schema: ZodSchema,
    revalidatePaths?: string | string[], // New parameter
    idName: string = "id"
  ): Promise<State> => {
    const id = Number(formData.get(idName));
    if (!id) {
      return {
        success: false,
        errors: { id: ["ID is required"] },
      };
    }

    return await this.handleAction(
      { [idName]: id } as { [key: string]: number },
      schema,
      () => this.delete(id.toString()),
      revalidatePaths
    );
  };
  /**
   * Helper to convert FormData to a plain object
   */
  private formDataToObject(formData: FormData): Record<string, string | File | File[]> {
    const data: Record<string, string | File | File[]> = {};
    const keys = Array.from(formData.keys());

    for (const key of keys) {
      const values = formData.getAll(key);

      // Skip empty values
      if (values.every(value => value === null || value === undefined || value === "")) {
        continue;
      }

      if (values.length > 1) {
        // If there are multiple values, filter for files
        const files = values.filter(v => v instanceof File) as File[];
        // Only add if there are actual files
        if (files.length > 0) {
          data[key] = files;
        }
      } else if (values[0] instanceof File) {
        // If it's a single file, check if it's a real file (not empty placeholder)
        const file = values[0] as File;
        if (file.size > 0 || file.name) {
          data[key] = file;
        }
      } else {
        // If it's a single string value
        data[key] = values[0] as string;
      }
    }
    return data;
  }
  /**
   * Helper to convert a plain object to FormData
   */
  private toFormData(data: Record<string, string | File | number | File[]>): FormData {
    const formData = new FormData();
    logger.debug({ data: Object.keys(data) }, 'Converting to FormData - keys');
    for (const key in data) {
      const value = data[key];
      if (value instanceof File) {
        formData.append(key, value, value.name);
        logger.debug({ key, fileName: value.name, size: value.size }, 'Appending file');
      } else if (Array.isArray(value)) {
        logger.debug({ key, arrayLength: value.length }, 'Appending array');
        for (const item of value) {
          if (item instanceof File) {
            formData.append(key, item, item.name);
          }
        }
      }
      else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
        logger.debug({ key, value: String(value) }, 'Appending value');
      }
    }
    return formData;
  }
}

/**
 * Create a typed API resource
 */
export function createApiResource<T, C = T, U = Partial<T>>(
  resourcePath: string,
  haveFiles: boolean = false
) {
  return new ApiResource<T, C, U>(resourcePath, haveFiles);
}
