'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addTransaction } from '@/actions/transaction';
import { Plus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other Income'];
const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Other Expense'];

const transactionSchema = z.object({
  type: z.enum(['Income', 'Expense']),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
});

export function AddTransactionModal() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Expense',
      amount: '',
      category: EXPENSE_CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  const { handleSubmit, control, watch, setValue, formState: { errors }, reset } = form;
  const type = watch('type');

  useEffect(() => {
    if (open) {
      reset({
        type: 'Expense',
        amount: '',
        category: EXPENSE_CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
  }, [open, reset]);

  useEffect(() => {
    setValue('category', type === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  }, [type, setValue]);

  const categories = type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const onSubmit = async (data) => {
    setIsPending(true);
    try {
      const result = await addTransaction(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Transaction added successfully!');
        setOpen(false);
      }
    } catch (err) {
      toast.error('Something went wrong!');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200" />
        }
      >
        <Plus className="h-4 w-4" />
        Add Transaction
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your transaction here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="type" className="sm:text-right">Type</Label>
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="amount" className="sm:text-right">Amount</Label>
              <div className="sm:col-span-3">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('amount')}
                />
              </div>
            </div>
            {errors.amount && <p className="text-sm text-destructive sm:ml-[25%]">{errors.amount.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="category" className="sm:text-right">Category</Label>
              <div className="sm:col-span-3">
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            {errors.category && <p className="text-sm text-destructive sm:ml-[25%]">{errors.category.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="date" className="sm:text-right">Date</Label>
              <div className="sm:col-span-3">
                <Input
                  id="date"
                  type="date"
                  {...form.register('date')}
                />
              </div>
            </div>
            {errors.date && <p className="text-sm text-destructive sm:ml-[25%]">{errors.date.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="note" className="sm:text-right">Note</Label>
              <div className="sm:col-span-3">
                <Input
                  id="note"
                  placeholder="Optional description"
                  {...form.register('note')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
