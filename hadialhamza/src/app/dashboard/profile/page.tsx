import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Budget from "@/models/Budget";
import SectionTitle from "@/components/ui/SectionTitle";
import ProfileManager from "@/components/dashboard/profile/ProfileManager";

export const metadata = {
  title: "Profile | SpendSentry",
  description: "Manage your SpendSentry profile and account settings",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  // Fetch stats concurrently
  const [transactionCount, budgetCount] = await Promise.all([
    Transaction.countDocuments({ userId: user._id }),
    Budget ? Budget.countDocuments({ userId: user._id }).catch(() => 0) : 0,
  ]);

  const userData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
  };

  const stats = {
    transactionCount,
    budgetCount,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Profile Settings"
        subtitle="Manage your account details, security, and preferences"
      />
      <ProfileManager user={userData} stats={stats} />
    </div>
  );
}
