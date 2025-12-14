"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createAddress } from "@/lib/network/api/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Address, CreateAddressDTO } from "@/lib/types/main";

interface AddressFormProps {
    userId: number;
    address?: Address;
    onCancel: () => void;
    onSuccess: () => void;
}

export function AddressForm({ userId, address, onCancel, onSuccess }: AddressFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateAddressDTO>({
        fullName: address?.fullName || "",
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zipCode || "",
        country: address?.country || "",
        isDefault: address?.isDefault || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await createAddress(userId, formData);
            toast.success(address ? "Address updated successfully!" : "Address added successfully!");
            router.refresh();
            onSuccess();
        } catch (error) {
            toast.error("Failed to save address");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="123 Main St"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="New York"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="NY"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="10001"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="USA"
                        required
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) =>
                        setFormData({ ...formData, isDefault: checked as boolean })
                    }
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default address
                </Label>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : address ? "Update Address" : "Add Address"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
