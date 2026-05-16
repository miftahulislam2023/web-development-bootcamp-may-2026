"use client";

import { useState } from "react";
import { Lock, Download, Sparkles, Layout, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { createTemplateCheckout } from "@/actions/billing";

export function TemplateCard({ template, session, onPreview, onUse, isPending }) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isLocked = template.isPremium && !template.owned;

  const handlePurchase = async () => {
    if (!session?.user) {
      toast.error("Please sign in to unlock premium templates");
      return;
    }
    setIsPurchasing(true);
    try {
      const res = await createTemplateCheckout(template.id);
      if (res.ok && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "Failed to initiate checkout");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (isLocked) {
      toast.error("Please unlock this template first");
      return;
    }
    
    setIsDownloading(true);
    toast.loading("Generating your ZIP...", { id: "download" });

    try {
      const response = await fetch("/api/templates/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.slug}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Template downloaded successfully!", { id: "download" });
    } catch (e) {
      toast.error(e.message || "An error occurred during download", { id: "download" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 flex flex-col">
      {/* Thumbnail Area */}
      <div className="relative h-56 overflow-hidden bg-[var(--muted)]">
        <img 
          src={template.thumbnail} 
          alt={template.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
        
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-10 bg-gray-950/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="size-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
              <Lock className="size-7" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
            template.isPremium 
            ? "bg-amber-500/20 text-amber-500 border-amber-500/20" 
            : "bg-emerald-500/20 text-emerald-500 border-emerald-500/20"
          }`}>
            {template.isPremium ? "Premium" : "Free"}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 z-20 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6">
           {isLocked ? (
             <Button 
               className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black"
               onClick={handlePurchase}
               disabled={isPurchasing}
             >
               {isPurchasing ? "Redirecting..." : (
                 <span className="flex items-center gap-2"><CreditCard className="size-4" /> Unlock for ${(template.priceCents / 100).toFixed(2)}</span>
               )}
             </Button>
           ) : (
             <Button 
               className="w-full bg-white text-black hover:bg-gray-100 font-black"
               onClick={() => onUse(template.id)}
               disabled={isPending}
             >
               {isPending ? "Setting up..." : <span className="flex items-center gap-2"><Layout className="size-4" /> Use Template</span>}
             </Button>
           )}
           <div className="flex w-full">
             <Button 
               variant="outline" 
               className="w-full border-white/20 text-white hover:bg-white/10 font-bold text-xs"
               onClick={() => onPreview(template)}
             >
               Preview
             </Button>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-grow flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <h3 className="font-display font-bold text-lg leading-tight">{template.name}</h3>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">{template.description}</p>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--border)]">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{template.category}</span>
          {template.owned && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <Check className="size-3" /> Purchased
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
