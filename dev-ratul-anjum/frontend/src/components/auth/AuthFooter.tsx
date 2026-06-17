import Link from "next/link";

const AuthFooter = () => {
  return (
    <p className="mt-8 text-xs text-slate-400 text-center max-w-md">
      By clicking continue, you agree to our{" "}
      <Link
        prefetch={false}
        href="/terms-of-service"
        className="underline hover:text-slate-600"
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        prefetch={false}
        href="/privacy-policy"
        className="underline hover:text-slate-600"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
};

export default AuthFooter;
