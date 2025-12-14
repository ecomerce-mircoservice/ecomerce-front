"use server";

import { getCurrentUser } from "./auth";
import { fetchData } from "../utils/main";
import type { Address, AddressResponse, AddressListResponse, CreateAddressDTO } from "../../types/main";
import type { ApiResponse } from "../../types/subTypes/commonTypes";

/**
 * Get user profile
 */
export async function getUserProfile(userId: number) {
    try {
        const response = await fetchData<ApiResponse<any>>(
            `/api/v1/users/${userId}/profile`,
            { method: "GET" }
        ) as ApiResponse<any>;
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: number, data: { name?: string; email?: string }) {
    try {
        const response = await fetchData<ApiResponse<any>>(
            `/api/v1/users/${userId}/profile`,
            {
                method: "PUT",
                body: JSON.stringify(data),
            }
        ) as ApiResponse<any>;
        return response;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

/**
 * Get all addresses for a user
 */
export async function getUserAddresses(userId: number): Promise<Address[]> {
    try {
        const response = await fetchData<AddressListResponse>(
            `/api/v1/users/${userId}/addresses`,
            { method: "GET" }
        ) as AddressListResponse;
        return response.data || [];
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        return [];
    }
}

/**
 * Create a new address
 */
export async function createAddress(userId: number, address: CreateAddressDTO): Promise<AddressResponse> {
    try {
        const response = await fetchData<AddressResponse>(
            `/api/v1/users/${userId}/addresses`,
            {
                method: "POST",
                body: JSON.stringify(address),
            }
        ) as AddressResponse;
        return response;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
}

/**
 * Delete an address
 */
export async function deleteAddress(userId: number, addressId: number): Promise<ApiResponse<null>> {
    try {
        const response = await fetchData<ApiResponse<null>>(
            `/api/v1/users/${userId}/addresses/${addressId}`,
            { method: "DELETE" }
        ) as ApiResponse<null>;
        return response;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
}
