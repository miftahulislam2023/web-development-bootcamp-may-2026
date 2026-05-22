'use client';

import { FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useState } from 'react';

export function ExportButtons({ transactions }) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF();
      
      // Add Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Transaction Report', 14, 22);
      
      // Add Date Range
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy h:mm a')}`, 14, 30);
      
      // Add Summary
      const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpense;

      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(`Total Income: BDT ${totalIncome.toFixed(2)}`, 14, 40);
      doc.text(`Total Expense: BDT ${totalExpense.toFixed(2)}`, 14, 46);
      doc.text(`Net Balance: BDT ${balance.toFixed(2)}`, 14, 52);

      // Create Table
      const tableColumn = ["Date", "Type", "Category", "Note", "Amount (BDT)"];
      const tableRows = [];

      transactions.forEach(tx => {
        const rowData = [
          format(new Date(tx.date), 'MMM dd, yyyy'),
          tx.type,
          tx.category,
          tx.note || '-',
          `${tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}`
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [15, 23, 42], textColor: 255 }, // Slate 900
        alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate 50
        columnStyles: {
          4: { halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: function (data) {
          if (data.section === 'body' && data.column.index === 4) {
            if (data.row.raw[1] === 'Income') {
              data.cell.styles.textColor = [16, 185, 129]; // Emerald 500
            } else {
              data.cell.styles.textColor = [244, 63, 94]; // Rose 500
            }
          }
        }
      });

      doc.save(`transactions_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      const exportData = transactions.map(tx => ({
        Date: format(new Date(tx.date), 'yyyy-MM-dd HH:mm'),
        Type: tx.type,
        Category: tx.category,
        Amount: tx.type === 'Income' ? Math.abs(tx.amount) : -Math.abs(tx.amount),
        Note: tx.note || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      
      XLSX.writeFile(workbook, `transactions_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-950/50"
        onClick={handleExportPDF}
        disabled={isExportingPDF || transactions.length === 0}
      >
        <FileText className="w-4 h-4 mr-2" />
        {isExportingPDF ? 'Exporting...' : 'PDF'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:border-emerald-900/50 dark:hover:bg-emerald-950/50"
        onClick={handleExportExcel}
        disabled={isExportingExcel || transactions.length === 0}
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        {isExportingExcel ? 'Exporting...' : 'Excel'}
      </Button>
    </div>
  );
}
