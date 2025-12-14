"use server";
import { ZodSchema } from "zod";
import { ApiResponse } from "@/lib/types/subTypes/commonTypes";
import { State } from "@/lib/schema/base";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils/logger";

export async function handleAction<T, CreateDTO, UpdateDTO>(
  data: CreateDTO | UpdateDTO | Record<string, string | number | File>,
  schema: ZodSchema,
  action: () => Promise<ApiResponse<T | null>>,
  revalidatePaths?: string | string[] // New parameter
): Promise<State> {
  try {
    // Transform data while preserving File objects
    const transformedData: Record<string, string | number | File | File[]> = {};
    for (const key in data as Record<string, string | number | File | File[]>) {
      const value = (data as Record<string, any>)[key];

      // Preserve File objects
      if (value instanceof File) {
        transformedData[key] = value;
      }
      // Preserve File arrays
      else if (Array.isArray(value) && value.every(v => v instanceof File)) {
        transformedData[key] = value;
      }
      // Convert numeric strings to numbers
      else if (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "") {
        transformedData[key] = Number(value);
      }
      // Keep everything else as-is
      else {
        transformedData[key] = value;
      }
    }
    logger.debug({ data: Object.keys(transformedData) }, 'Transformed form data keys');
    const parsed = schema.safeParse(transformedData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      logger.warn({ errors: fieldErrors }, 'Validation errors');
      return {
        success: false,
        errors: fieldErrors as Record<string, string[]>,
      };
    }
    const returnedData = await action();

    // Revalidate paths if provided and action was successful
    if (revalidatePaths) {
      if (Array.isArray(revalidatePaths)) {
        revalidatePaths.forEach((path) => revalidatePath(path));
      } else {
        revalidatePath(revalidatePaths);
      }
    }
    return {
      success: true,
      errors: {},
      data: returnedData,
    };
  } catch (error) {
    logger.error({ error: (error as Error).message }, 'Action error');
    return {
      success: false,
      errors: { general: [(error as Error).message] },
      data: null,
    };
  }
}
