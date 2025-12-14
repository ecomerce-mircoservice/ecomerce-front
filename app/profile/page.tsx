import { getCurrentUser } from "@/lib/network/api/auth";
import { getUserProfile, getUserAddresses } from "@/lib/network/api/profile";
import { HeaderWrapper } from "@/components/header-wrapper";
import { ProfileClient } from "./_components/profile-client";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login?redirect=/profile");
    }

    const [profile, addresses] = await Promise.all([
        getUserProfile(user.id),
        getUserAddresses(user.id),
    ]);

    return (
        <div className="min-h-screen bg-background">
            <HeaderWrapper />
            <ProfileClient user={user} profile={profile} addresses={addresses} />
        </div>
    );
}
