import { UseFormReturn } from "react-hook-form";
import { ApiResponse } from "../types/subTypes/commonTypes";
export interface FieldConfig {
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: React.ReactNode;
  options?: { value: string; label: string; description?: string }[];
  onValueChange?: (value: string | number) => void;
  customRender?: (form: UseFormReturn, state: State) => React.ReactElement;
  // File input specific properties
  accept?: string;
  multiple?: boolean;
  // Textarea specific properties
  rows?: number;
  // Radio group specific properties
  layout?: "horizontal" | "vertical";
  defaultValue?: string | number | boolean;
  variant?: "default" | "dropzone"; // For file inputs, can be 'default' or 'dropzone'
}

export interface State<T = unknown> {
  success: boolean;
  errors: Record<string, string[]>;
  data?: ApiResponse<T> | null;
  [key: string]: any; // Allow additional fields like checkoutUrl
}
