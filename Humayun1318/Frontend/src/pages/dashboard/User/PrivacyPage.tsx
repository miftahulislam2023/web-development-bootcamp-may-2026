
import { ChangePasswordForm } from "@/components/modules/dashboard/user/privacy/ChangePasswordForm";
import { SetPasswordForm } from "@/components/modules/dashboard/user/privacy/SetPasswordForm";
import { useUser } from "@/hooks/useUser";

export default function PrivacyPage() {
  const { user: userData, isLoading } = useUser();

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8 space-y-6">
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Loading…
        </div>
      ) : !userData ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Unable to load data.
        </div>
      ) : (
        <>
          {/* header */}
          <div>
            <h1 className="text-xl font-semibold">Privacy & Security</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your account security settings.
            </p>
          </div>

          {(() => {
            // Detect if user signed up via Google only (no local auth)
            const providers = userData.auths.map(
              (a: { provider: string }) => a.provider,
            );

            const isGoogleOnlyUser =
              providers.includes("google") && !providers.includes("local");

            return isGoogleOnlyUser ? (
              <SetPasswordForm />
            ) : (
              <ChangePasswordForm />
            );
          })()}
        </>
      )}
    </div>
  );
}
