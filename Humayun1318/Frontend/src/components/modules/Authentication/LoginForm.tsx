import { GoogleLogo } from "@/assets/icons/GoogleLogo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import config from "@/config";
import { role } from "@/constants/role";
import { cn } from "@/lib/utils";
import { authApi, useLoginMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { TRole } from "@/types";
import { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function LoginForm({
  className,
  demoCredentials,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { demoCredentials: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // form
  const form = useForm({
    //! For development only
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (demoCredentials.includes("Admin")) {
      form.setValue("email", "admin@gmail.com");
      form.setValue("password", "Admin123");
    } else if (demoCredentials.includes("User")) {
      form.setValue("email", "user@gmail.com");
      form.setValue("password", "User1234");
    }
  }, [demoCredentials]);

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!data.email || !data.password) {
      toast.error("Please fill in all fields", {
        position: "top-center",
      });
      return;
    }
    if (data?.password?.length < 8) {
      toast.error("Password must be at least 8 characters", {
        position: "top-center",
      });
      return;
    }
    const toastId = toast.loading("Logging in...", { position: "top-center" });

    try {
      const res = await login(data).unwrap();

      if (res.success) {
        dispatch(authApi.util.invalidateTags(["USER"]));

        toast.success("Logged in successfully", {
          id: toastId,
          position: "top-center",
        });

        if ((res?.data?.user?.role as TRole) === role.user) {
          navigate("/user");
        } else if ((res?.data?.user?.role as TRole) === role.admin) {
          navigate("/admin");
        }
      }
    } catch (err) {
      const errorMessage = (err as any)?.data?.message;
      if (errorMessage === "User is deleted") {
        toast.error(
          "Your account has been deleted, if you think this is a mistake, please contact support.",
          {
            id: toastId,
            position: "top-center",
          },
        );
      } else if (errorMessage === "Password does not match") {
        toast.error("Invalid credentials", {
          id: toastId,
          position: "top-center",
        });
      } else if (errorMessage === "User does not exist") {
        toast.error("You don't have account, Please register first", {
          id: toastId,
          position: "top-center",
        });
      } else {
        toast.error("Login failed. Please try again.", {
          id: toastId,
          position: "top-center",
        });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-balance text-sm text-slate-400">
          Track your expenses seamlessly
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      className="border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        {/* divider */}
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-800">
          <span className="relative z-10 bg-slate-950 px-2 text-slate-400">
            Or continue with
          </span>
        </div>
        {/* Google CTA */}
        <Button
          onClick={() =>
            (window.location.href = `${config.baseUrl}/auth/google?redirect=/user`)
          }
          type="button"
          variant="outline"
          className="w-full cursor-pointer border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <GoogleLogo className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
      </div>

      {/* to register link */}
      <div className="text-center text-sm">
        <span className="text-slate-400">Don't have an account? </span>
        <Link
          to="/register"
          replace
          className="text-emerald-500 underline underline-offset-4 hover:text-emerald-400 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
