// src/components/layout/TopNavbar.jsx

import Link from "next/link";
import { Wallet } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 h-[60px] flex items-center px-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Wallet size={17} className="text-white" />
        </div>
        <span className="text-[17px] font-semibold text-slate-800 tracking-tight">
          Expense<span className="text-indigo-500"> Tracker</span>
        </span>
      </Link>
    </header>
  );
}
