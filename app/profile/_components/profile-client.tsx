"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Plus } from "lucide-react";
import type { User as UserType, Address } from "@/lib/types/main";
import { ProfileForm } from "./profile-form";
import { AddressList } from "./address-list";
import { AddressForm } from "./address-form";

interface ProfileClientProps {
    user: UserType;
    profile: any;
    addresses: Address[];
}

export function ProfileClient({ user, profile, addresses }: ProfileClientProps) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <CardTitle>Profile Information</CardTitle>
                        </div>
                        {!isEditingProfile && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingProfile(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isEditingProfile ? (
                            <ProfileForm
                                user={user}
                                profile={profile}
                                onCancel={() => setIsEditingProfile(false)}
                                onSuccess={() => setIsEditingProfile(false)}
                            />
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    <p className="font-medium capitalize">
                                        {user.roles.replace("ROLE_", "").toLowerCase()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Saved Addresses */}
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <CardTitle>Saved Addresses</CardTitle>
                        </div>
                        {!isAddingAddress && !editingAddress && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddingAddress(true)}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Address
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isAddingAddress ? (
                            <AddressForm
                                userId={user.id}
                                onCancel={() => setIsAddingAddress(false)}
                                onSuccess={() => setIsAddingAddress(false)}
                            />
                        ) : editingAddress ? (
                            <AddressForm
                                userId={user.id}
                                address={editingAddress}
                                onCancel={() => setEditingAddress(null)}
                                onSuccess={() => setEditingAddress(null)}
                            />
                        ) : (
                            <AddressList
                                userId={user.id}
                                addresses={addresses}
                                onEdit={(address) => setEditingAddress(address)}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
