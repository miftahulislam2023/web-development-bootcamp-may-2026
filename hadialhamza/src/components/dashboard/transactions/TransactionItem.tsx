"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Trash2, Pencil, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

import { Transaction } from "@/types/dashboard";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionItem({ transaction, onDelete, onEdit }: TransactionItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isExpense = transaction.type === "expense";
  const category = transaction.categoryId;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(transaction._id);
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl", category?.color || "bg-muted text-muted-foreground", category?.color?.replace('text-', 'bg-').replace('-500', '-500/10'))}>
            <CategoryIcon name={category?.icon || "Tag"} className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
              {transaction.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {category?.name || "Uncategorized"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className={cn("text-sm font-black tracking-tight", isExpense ? "text-foreground" : "text-emerald-500")}>
              {isExpense ? "-" : "+"}{formatCurrency(transaction.amount)}
            </p>
            {transaction.note && (
              <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[100px]">
                {transaction.note}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1 transition-opacity">
            <button 
              onClick={() => onEdit(transaction)}
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Transaction"
        maxWidth="max-w-sm"
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
              <AlertCircle className="w-10 h-10" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-base font-black text-foreground">Are you absolutely sure?</h4>
            <p className="text-sm text-muted-foreground">
              This will permanently remove the <span className="font-bold text-foreground">{transaction.name}</span> record. This action cannot be undone.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full bg-rose-500 hover:bg-rose-600 border-rose-500 shadow-rose-500/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete It"}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
