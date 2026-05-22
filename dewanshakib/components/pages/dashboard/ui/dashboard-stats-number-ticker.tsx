import { NumberTicker } from "@/components/ui/number-ticker";

export default function DashboardStatsNumberTicker({
  value,
}: {
  value: number;
}) {
  return (
    <div className="flex items-center flex-row gap-x-1 text-2xl  mt-5 ">
      <span className="font-semibold">$</span>
      <div className="font-semibold flex items-center gap-x-0.5 flex-row">
        <NumberTicker
          value={value}
          className="text-2xl font-semibold tracking-tighter whitespace-pre-wrap text-black dark:text-white"
        />
        <span>.00</span>
      </div>
    </div>
  );
}
