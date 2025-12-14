import { FieldConfig } from "@/lib/schema/base";
import { z } from "zod";

// --- Schemas (for client-side validation) ---
// These match the server-side schemas in lib/actions/products.ts
// but are defined here for direct use in forms if needed for client-side validation,
// or as a reference for field configurations.

export const createProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(), // Made optional
    price: z.preprocess(
        (val) => Number(val),
        z.number().positive("Price must be a positive number")
    ),
    category: z.string().min(1, "Category is required"),
    mainImage: z.instanceof(File, { message: "Image file is required" }),
    secondaryImages: z.preprocess(
        (val) => {
            // If it's undefined, null, or empty array, return undefined
            if (!val || (Array.isArray(val) && val.length === 0)) {
                return undefined;
            }
            // If it's not an array, return undefined
            if (!Array.isArray(val)) {
                return undefined;
            }
            return val;
        },
        z.array(z.instanceof(File)).optional()
    ),
    stockQuantity: z.preprocess(
        (val) => Number(val),
        z.number().int().nonnegative("Stock must be a non-negative integer")
    ),
    active: z.boolean().default(true),
    rating: z.number().min(0).max(5).default(5), // Default to 5 stars
});

export const updateProductSchema = z.object({
    id: z.preprocess((val) => Number(val), z.number()),
    name: z.string().min(1, "Product name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    price: z.preprocess(
        (val) => Number(val),
        z.number().positive("Price must be a positive number").optional()
    ),
    category: z.string().min(1, "Category is required").optional(),
    mainImage: z.instanceof(File).optional(), // File input handled separately in BaseForm
    secondaryImages: z.array(z.instanceof(File)).optional(), // File input handled separately in BaseForm
    stockQuantity: z.preprocess(
        (val) => Number(val),
        z.number().int().nonnegative("Stock must be a non-negative integer").optional()
    ),
    active: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
});

export const deleteProductSchema = z.object({
    id: z.preprocess((val) => Number(val), z.number()),
});


// --- Field Configurations for Forms ---

export const createProductRenderedFields: FieldConfig[] = [
    {
        name: "name",
        label: "Product Name",
        type: "text",
        placeholder: "Enter product name",
        required: true,
    },
    {
        name: "description",
        label: "Description (Optional)",
        type: "textarea",
        placeholder: "Enter product description (optional)",
        required: false,
        rows: 4,
    },
    {
        name: "price",
        label: "Price ($)",
        type: "number",
        placeholder: "19.99",
        required: true,
    },
    {
        name: "stockQuantity",
        label: "Stock Quantity",
        type: "number",
        placeholder: "100",
        required: true,
    },
    {
        name: "category",
        label: "Category",
        type: "select",
        placeholder: "Select category",
        options: [
            { value: "Electronics", label: "Electronics" },
            { value: "Clothing", label: "Clothing" },
            { value: "Books", label: "Books" },
            { value: "Home & Garden", label: "Home & Garden" },
            { value: "Sports", label: "Sports" },
            { value: "Toys", label: "Toys" },
            // Add more categories as needed
        ],
        required: true,
    },
    {
        name: "mainImage",
        label: "Main Product Image",
        type: "file",
        required: true,
        accept: "image/*",
        variant: "dropzone",
    },
    {
        name: "secondaryImages",
        label: "Secondary Product Images (Optional)",
        type: "file",
        required: false,
        accept: "image/*",
        variant: "dropzone",
        multiple: true,
    },
    // Active and Rating can be handled with default values or specific fields if needed
];

export const updateProductRenderedFields: FieldConfig[] = [
    {
        name: "id",
        type: "hidden",
        required: true,
    },
    {
        name: "name",
        label: "Product Name",
        type: "text",
        placeholder: "Enter product name",
        required: false, // Optional for update
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter product description",
        required: false,
        rows: 4,
    },
    {
        name: "price",
        label: "Price ($)",
        type: "number",
        placeholder: "0.00",
        required: false,
    },
    {
        name: "stockQuantity",
        label: "Stock Quantity",
        type: "number",
        placeholder: "0",
        required: false,
    },
    {
        name: "category",
        label: "Category",
        type: "select",
        placeholder: "Select category",
        options: [
            { value: "Electronics", label: "Electronics" },
            { value: "Clothing", label: "Clothing" },
            { value: "Books", label: "Books" },
            { value: "Home & Garden", label: "Home & Garden" },
            { value: "Sports", label: "Sports" },
            { value: "Toys", label: "Toys" },
        ],
        required: false,
    },
    {
        name: "mainImage",
        label: "Main Product Image",
        type: "file",
        required: false,
        accept: "image/*",
        variant: "dropzone",
    },
    {
        name: "secondaryImages",
        label: "Secondary Product Images",
        type: "file",
        required: false,
        accept: "image/*",
        variant: "dropzone",
        multiple: true,
    },
    {
        name: "active",
        label: "Active",
        type: "radio",
        options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ],
        layout: "horizontal",
        required: false,
    },
    {
        name: "rating",
        label: "Rating",
        type: "number",
        placeholder: "0.0",
        required: false,
    },
];

export const deleteProductRenderedFields: FieldConfig[] = [
    {
        name: "id",
        type: "hidden",
        required: true,
    },
];
