"use client"

import { FileText, Users } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import DocList from "@/components/ui/DocList";
import useHome from "@/hooks/useHome";
import CreateDocButton from "@/components/ui/CreateDocButton";
import HomeHeader from "@/components/ui/HomeHeader";

export default function Home() {
  const { docs, shareDocs, createNewDoc } = useHome();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <HomeHeader />
            <CreateDocButton onClick={createNewDoc} />
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <DocList
            docs={docs}
            title="My Documents"
            icon={<FileText size={20} className="text-indigo-600" />}
            iconBg="indigo"
          />

          <DocList
            docs={shareDocs}
            title="Shared Documents"
            icon={<Users size={20} className="text-amber-600" />}
            iconBg="amber"
          />

        </div>
      </div>
    </main>
  )
}