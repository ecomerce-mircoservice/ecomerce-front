// Address entity for user addresses
export interface Address {
    id: number;
    userId: number;
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAddressDTO {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
}

export interface UpdateAddressDTO {
    id: number;
    fullName?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
}

export interface AddressResponse {
    success: boolean;
    data: Address;
    message?: string;
}

export interface AddressListResponse {
    success: boolean;
    data: Address[];
    message?: string;
}
