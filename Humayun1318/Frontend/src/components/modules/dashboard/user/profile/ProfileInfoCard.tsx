import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Mail, Globe, ShieldCheck, ShieldAlert } from "lucide-react";
import { IUser } from "@/types";
import { getInitials } from "@/utils/getInitials";
import { formatDate } from "@/utils/formatDate";
import { getProviderLabel } from "@/utils/getProviderLabel";

interface ProfileInfoCardProps {
  user: IUser;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      {/* Avatar + name + email */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 text-xl">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold leading-none">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Role */}
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>

            {/* Status */}
            <Badge
              variant="outline"
              className={
                user.status === "active"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-600"
              }
            >
              {user.status}
            </Badge>

            {/* Verified */}
            {user.isVerified ? (
              <Badge
                variant="outline"
                className="border-blue-500/40 bg-blue-500/10 text-blue-600 gap-1"
              >
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-amber-600 gap-1"
              >
                <ShieldAlert className="h-3 w-3" />
                Unverified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <InfoRow
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          value={user.email}
        />
        <InfoRow
          icon={<Globe className="h-4 w-4" />}
          label="Timezone"
          value={user.timezone}
        />
        <InfoRow
          icon={<span className="text-xs font-bold">₳</span>}
          label="Currency"
          value={
            <span className="flex items-center gap-1.5">
              {user.currency}
              <span className="text-xs text-muted-foreground">
                (read-only — changing currency affects all past transactions)
              </span>
            </span>
          }
        />
        <InfoRow
          icon={<CalendarDays className="h-4 w-4" />}
          label="Joined"
          value={formatDate(user.createdAt)}
        />
        <InfoRow
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Login via"
          value={getProviderLabel(user.auths)}
        />
      </div>
    </div>
  );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}