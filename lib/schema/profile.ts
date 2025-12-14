import { FieldConfig } from "@/lib/schema/base";
import { z } from "zod";

// Profile schema
export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
});

// Address schema
export const addressSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    isDefault: z.boolean().default(false),
});

// Field configurations
export const profileFields: FieldConfig[] = [
    {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter your full name",
        required: true,
    },
    {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "Enter your email",
        required: true,
    },
];

export const addressFields: FieldConfig[] = [
    {
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        required: true,
    },
    {
        name: "street",
        label: "Street Address",
        type: "text",
        placeholder: "123 Main St",
        required: true,
    },
    {
        name: "city",
        label: "City",
        type: "text",
        placeholder: "New York",
        required: true,
    },
    {
        name: "state",
        label: "State/Province",
        type: "text",
        placeholder: "NY",
        required: true,
    },
    {
        name: "zipCode",
        label: "ZIP/Postal Code",
        type: "text",
        placeholder: "10001",
        required: true,
    },
    {
        name: "country",
        label: "Country",
        type: "text",
        placeholder: "USA",
        required: true,
    },
];
