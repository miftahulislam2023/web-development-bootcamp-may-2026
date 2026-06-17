<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $totalIncome = Transaction::where('user_id', $user->id)->where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('user_id', $user->id)->where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        $recent = Transaction::where('user_id', $user->id)->latest()->take(6)->with('category')->get();

        // Monthly breakdown (last 6 months) — use DB-specific date formatting
        $driver = \Illuminate\Support\Facades\DB::getPdo()->getAttribute(\PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            $monthExpr = "strftime('%Y-%m', date)";
        } else {
            $monthExpr = "DATE_FORMAT(`date`, '%Y-%m')";
        }

        $monthsRaw = Transaction::where('user_id', $user->id)
            ->selectRaw("{$monthExpr} as month, SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense, SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get();

        // reverse to chronological order
        $months = $monthsRaw->reverse()->values();

        // current month totals
        $currentMonth = now()->format('Y-m');
        $monthlyIncome = $months->last()?->income ?? Transaction::where('user_id', $user->id)->where('type','income')->whereRaw("{$monthExpr} = ?", [$currentMonth])->sum('amount');
        $monthlyExpense = $months->last()?->expense ?? Transaction::where('user_id', $user->id)->where('type','expense')->whereRaw("{$monthExpr} = ?", [$currentMonth])->sum('amount');

        $savingsRate = ($monthlyIncome > 0) ? round((($monthlyIncome - $monthlyExpense) / $monthlyIncome) * 100, 1) : null;

        // category breakdown for doughnut (current month)
        $driver = \Illuminate\Support\Facades\DB::getPdo()->getAttribute(\PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            $monthExpr = "strftime('%Y-%m', date)";
        } else {
            $monthExpr = "DATE_FORMAT(`date`, '%Y-%m')";
        }

        $current = now()->format('Y-m');
        $categoryBreakdown = Transaction::where('user_id', $user->id)
            ->whereRaw("{$monthExpr} = ?", [$current])
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->with('category')
            ->get();

        // simple insight: compare expense to previous month
        $prevMonth = now()->subMonth()->format('Y-m');
        $prevExpense = Transaction::where('user_id', $user->id)
            ->where('type','expense')
            ->whereRaw("{$monthExpr} = ?", [$prevMonth])
            ->sum('amount');

        $insight = null;
        if ($prevExpense > 0) {
            $diff = $monthlyExpense - $prevExpense;
            $pct = round(($diff / $prevExpense) * 100, 1);
            if ($pct > 0) {
                $insight = "You spent {$pct}% more than last month.";
            } else {
                $insight = "Good job — spending down by " . abs($pct) . "% compared to last month.";
            }
        }

        return view('dashboard', compact('totalIncome', 'totalExpense', 'balance', 'recent', 'months', 'monthlyIncome', 'monthlyExpense', 'savingsRate', 'categoryBreakdown', 'insight'));
    }
}
