
import { ProfileInfoCard } from "@/components/modules/dashboard/user/profile/ProfileInfoCard";
import { UpdateProfileForm } from "@/components/modules/dashboard/user/profile/UpdateProfileForm";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  const { user: userData, isLoading } = useUser();

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8 space-y-6">
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Loading profile…
        </div>
      ) : !userData ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Unable to load profile data.
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-xl font-semibold">Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              View and manage your personal information.
            </p>
          </div>

          {/* User info display */}
          <ProfileInfoCard user={userData} />

          {/* Edit form */}
          <UpdateProfileForm
            currentName={userData.name}
            currentAvatarUrl={userData.avatarUrl}
          />
        </>
      )}
    </div>
  );
}
