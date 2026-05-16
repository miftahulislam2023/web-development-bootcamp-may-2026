<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::where('user_id', Auth::id())->get();

        $query = Transaction::where('user_id', Auth::id())->with('category');

        if ($q = $request->query('q')) {
            $query->where('note', 'like', "%{$q}%");
        }

        if ($cat = $request->query('category')) {
            $query->where('category_id', $cat);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($from = $request->query('from')) {
            $query->whereDate('date', '>=', $from);
        }

        if ($to = $request->query('to')) {
            $query->whereDate('date', '<=', $to);
        }

        $transactions = $query->latest()->paginate(12)->withQueryString();
        return view('transactions.index', compact('transactions', 'categories'));
    }

    public function create()
    {
        $categories = Category::where('user_id', Auth::id())->get();
        return view('transactions.form', ['transaction' => new Transaction(), 'categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric',
            'category_id' => 'nullable|exists:categories,id',
            'note' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $validated['user_id'] = Auth::id();

        Transaction::create($validated);
        return redirect()->route('transactions.index')->with('success', 'Transaction added.');
    }

    public function edit(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) abort(403);
        $categories = Category::where('user_id', Auth::id())->get();
        return view('transactions.form', compact('transaction', 'categories'));
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) abort(403);

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric',
            'category_id' => 'nullable|exists:categories,id',
            'note' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $transaction->update($validated);
        return redirect()->route('transactions.index')->with('success', 'Transaction updated.');
    }

    public function destroy(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) abort(403);
        $transaction->delete();
        return back()->with('success', 'Transaction deleted.');
    }

    public function exportCsv()
    {
        $transactions = Transaction::where('user_id', Auth::id())->orderBy('date', 'desc')->get();
        $filename = 'transactions_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($transactions) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Date','Type','Category','Amount','Note']);
            foreach ($transactions as $t) {
                fputcsv($handle, [ $t->date->toDateString(), $t->type, $t->category?->name, $t->amount, $t->note ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
