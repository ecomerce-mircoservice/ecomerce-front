"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Check } from "lucide-react";
import { deleteAddress } from "@/lib/network/api/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Address } from "@/lib/types/main";

interface AddressListProps {
    userId: number;
    addresses: Address[];
    onEdit: (address: Address) => void;
}

export function AddressList({ userId, addresses, onEdit }: AddressListProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (addressId: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        setDeletingId(addressId);
        try {
            await deleteAddress(userId, addressId);
            toast.success("Address deleted successfully!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete address");
        } finally {
            setDeletingId(null);
        }
    };

    if (addresses.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No saved addresses yet</p>
                <p className="text-sm mt-1">Add an address to use during checkout</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
                <Card key={address.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold">{address.fullName}</h4>
                        </div>
                        {address.isDefault && (
                            <Badge variant="outline" className="gap-1">
                                <Check className="h-3 w-3" />
                                Default
                            </Badge>
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1 mb-4">
                        <p>{address.street}</p>
                        <p>
                            {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p>{address.country}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(address)}
                            className="gap-2"
                        >
                            <Edit className="h-3 w-3" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(address.id)}
                            disabled={deletingId === address.id}
                            className="gap-2 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                            {deletingId === address.id ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
