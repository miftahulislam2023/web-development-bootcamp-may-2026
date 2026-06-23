import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <ShieldX className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Unauthorized Access
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        You don't have permission to access this page.
      </p>
      <Button onClick={() => navigate("/")}>Go Back Home</Button>
    </div>
  );
}
