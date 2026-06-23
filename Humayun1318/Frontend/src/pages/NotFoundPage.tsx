import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate("/")}>Go Back Home</Button>
    </div>
  );
}
