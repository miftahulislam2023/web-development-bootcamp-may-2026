"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import SelectGroup from "@/components/ui/SelectGroup";
import TransactionStats from "@/components/dashboard/transactions/TransactionStats";
import TransactionItem from "@/components/dashboard/transactions/TransactionItem";
import TransactionModal from "@/components/dashboard/transactions/TransactionModal";
import AddCategoryModal from "@/components/dashboard/transactions/AddCategoryModal";
import {
  TransactionItemSkeleton,
  TransactionStatsSkeleton,
} from "@/components/dashboard/transactions/TransactionSkeleton";
import { customToast } from "@/components/ui/customToast";
import { Transaction, Category } from "@/types/dashboard";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/categories"),
      ]);

      if (transRes.ok) {
        const transData = await transRes.json();
        setTransactions(transData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (error) {
      console.error("Fetch error", error);
      customToast.error("Error", "Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      try {
        const [transRes, catRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/categories"),
        ]);

        if (isMounted) {
          if (transRes.ok) {
            const transData = await transRes.json();
            setTransactions(transData);
          }
          if (catRes.ok) {
            const catData = await catRes.json();
            setCategories(catData);
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Fetch error", error);
          customToast.error("Error", "Failed to load transactions");
          setIsLoading(false);
        }
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        customToast.success("Deleted", "Transaction removed successfully");
      }
    } catch {
      customToast.error("Error", "Could not delete transaction");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory =
      filterCategory === "all" ||
      (t.categoryId && t.categoryId._id === filterCategory);
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-foreground tracking-tight"
          >
            Transactions
          </motion.h1>
          <p className="text-muted-foreground font-medium mt-1">
            Manage your income and expenses with ease.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <Button
            variant="outline"
            className="border-2 border-border font-black text-xs uppercase tracking-widest px-6"
            onClick={() => setIsCatModalOpen(true)}
          >
            Categories
          </Button>
          <Button
            variant="primary"
            className="shadow-xl shadow-primary/20 px-6"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAdd}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      {isLoading ? (
        <TransactionStatsSkeleton />
      ) : (
        <TransactionStats
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />
      )}

      {/* Filters & Search */}
      <div className="bg-card border border-border p-4 rounded-3xl flex flex-col xl:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <InputGroup
            placeholder="Search by description..."
            className="h-12 bg-muted/30 border-none"
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          <SelectGroup
            placeholder="All Types"
            value={filterType}
            onChange={(val) => setFilterType(val as string)}
            className="min-w-35 h-12 bg-muted/30 border-none"
            icon={<Wallet className="w-4 h-4" />}
            options={[
              { label: "All Types", value: "all" },
              {
                label: "Income",
                value: "income",
                icon: <ArrowDownLeft className="w-4 h-4 text-emerald-500" />,
              },
              {
                label: "Expense",
                value: "expense",
                icon: <ArrowUpRight className="w-4 h-4 text-rose-500" />,
              },
            ]}
          />

          <SelectGroup
            placeholder="All Categories"
            value={filterCategory}
            onChange={(val) => setFilterCategory(val as string)}
            className="min-w-45 h-12 bg-muted/30 border-none"
            icon={<Tag className="w-4 h-4" />}
            options={[
              { label: "All Categories", value: "all" },
              ...categories.map((c) => ({
                label: c.name,
                value: c._id,
              })),
            ]}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <TransactionItemSkeleton key={`tx-skeleton-${i}`} />
            ))}
          </div>
        ) : filteredTransactions.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-muted/30 border-2 border-dashed border-border rounded-3xl"
          >
            <div className="p-6 bg-background rounded-full shadow-sm mb-4">
              <Search className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No transactions found
            </h3>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              Try adjusting your filters or add a new record.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-2 border-border"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterCategory("all");
              }}
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        initialData={selectedTransaction}
        onOpenAddCategory={() => setIsCatModalOpen(true)}
      />
      <AddCategoryModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
