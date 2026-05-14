export default function Spinner({ size = "md" }) {
  const s = size === "sm" ? "w-5 h-5 border-2" : size === "lg" ? "w-12 h-12 border-4" : "w-8 h-8 border-3";
  return <div className={`${s} border-primary-500 border-t-transparent rounded-full animate-spin`} />;
}
