// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Password from "@/components/ui/Password";
// import { useRegisterMutation } from "@/redux/features/auth/auth.api";
// import { toast } from "sonner";

// const registerSchema = z
//   .object({
//     name: z
//       .string()
//       .min(3, {
//         error: "Name is too short",
//       })
//       .max(50),
//     email: z.email(),
//     password: z.string().min(8, { error: "Password is too short" }),
//     confirmPassword: z
//       .string()
//       .min(8, { error: "Confirm Password is too short" }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Password do not match",
//     path: ["confirmPassword"],
//   });

// export function RegisterForm({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLDivElement>) {
//   const [register] = useRegisterMutation();
//   const navigate = useNavigate();

//   const form = useForm<z.infer<typeof registerSchema>>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof registerSchema>) => {
//     const userInfo = {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//     };

//     try {
//       await register(userInfo).unwrap();

//       toast.success("User created successfully");
//       navigate("/verify");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <div className="flex flex-col items-center gap-2 text-center">
//         <h1 className="text-2xl font-bold">Register your account</h1>
//         <p className="text-sm text-muted-foreground">
//           Enter your details to create an account
//         </p>
//       </div>

//       <div className="grid gap-6">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="John Doe" {...field} />
//                   </FormControl>
//                   <FormDescription className="sr-only">
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="john.doe@company.com"
//                       type="email"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription className="sr-only">
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Password {...field} />
//                   </FormControl>
//                   <FormDescription className="sr-only">
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="confirmPassword"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Confirm Password</FormLabel>
//                   <FormControl>
//                     <Password {...field} />
//                   </FormControl>
//                   <FormDescription className="sr-only">
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="w-full">
//               Submit
//             </Button>
//           </form>
//         </Form>

//         <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//           <span className="relative z-10 bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>

//         <Button
//           type="button"
//           variant="outline"
//           className="w-full cursor-pointer"
//         >
//           Login with Google
//         </Button>
//       </div>

//       <div className="text-center text-sm">
//         Already have an account?{" "}
//         <Link to="/login" className="underline underline-offset-4">
//           Login
//         </Link>
//       </div>
//     </div>
//   );
// }
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Password from "@/components/ui/Password";
import { authApi, useRegisterMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import config from "@/config";
import { GoogleLogo } from "@/assets/icons/GoogleLogo";
import { role } from "@/constants/role";
import { useAppDispatch } from "@/redux/hook";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        error: "Name is too short",
      })
      .max(50),
    email: z.email(),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      })
      .max(60, {
        message: "Password cannot exceed 60 characters",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must contain at least one number",
      }),
    confirmPassword: z
      .string()
      .min(8, { error: "Confirm Password is too short" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const toastId = toast.loading("Creating your account...", {
      position: "top-center",
    });

    try {
      const res = await register(userInfo).unwrap();

      if (res.success) {
        dispatch(authApi.util.invalidateTags(["USER"]));
        toast.success("Account created successfully! Logging you in...", {
          id: toastId,
          position: "top-center",
        });

        const { user } = res.data;

        if (user?.role === role.user) {
          navigate("/user");
        } else if (user?.role === role.admin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    } catch (err: any) {
      const statusCode = err?.status;
      if (
        err.data?.message.trim() ===
        "An account with this email address was previously deleted. Please contact support if you believe this is a mistake."
      ) {
        toast.error(
          "An account with this email address was previously deleted. Please contact support if you believe this is a mistake.",
          {
            id: toastId,
            position: "top-center",
          },
        );
      } else if (statusCode === 409) {
        toast.error("Email already registered. Please login instead.", {
          id: toastId,
          position: "top-center",
        });
      } else if (statusCode === 400) {
        toast.error("Password is too weak. Please use a stronger password.", {
          id: toastId,
          position: "top-center",
        });
      } else {
        toast.error("Registration failed. Please try again.", {
          id: toastId,
          position: "top-center",
        });
      }
      console.error(err);
      console.log(err?.status);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-balance text-sm text-slate-400">
          Start tracking your expenses today
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@company.com"
                      type="email"
                      className="border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
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
                    <Password
                      className="border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your password filed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Password
                      className="border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your confirm password field.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-800">
          <span className="relative z-10 bg-slate-950 px-2 text-slate-400">
            Or continue with
          </span>
        </div>

        <Button
          onClick={() =>
            (window.location.href = `${config.baseUrl}/auth/google?redirect=/user`)
          }
          type="button"
          variant="outline"
          className="w-full cursor-pointer border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <GoogleLogo className="mr-2 h-4 w-4" />
          Register with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-slate-400">Already have an account? </span>
        <Link
          to="/login"
          className="text-emerald-500 underline underline-offset-4 hover:text-emerald-400 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
