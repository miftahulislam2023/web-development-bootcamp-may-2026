import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateProfileName } from "@/actions/profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmailVerificationBanner } from "@/components/dashboard/EmailVerificationBanner";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true, emailVerified: true },
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <EmailVerificationBanner email={user.email} verified={Boolean(user.emailVerified)} />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            action={async (formData) => {
              "use server";
              await updateProfileName(formData.get("name"));
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" name="name" defaultValue={user.name || ""} required />
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Role: {user.role}</p>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
