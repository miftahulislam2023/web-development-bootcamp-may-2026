'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/actions/transaction';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TransactionRowActions({ id }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      startTransition(async () => {
        try {
          const result = await deleteTransaction(id);
          if (result?.error) {
            toast.error(result.error);
          } else {
            toast.success('Transaction deleted');
          }
        } catch (error) {
          toast.error('Failed to delete transaction');
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          variant="destructive"
          onClick={handleDelete} 
          disabled={isPending}
          className="cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isPending ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
