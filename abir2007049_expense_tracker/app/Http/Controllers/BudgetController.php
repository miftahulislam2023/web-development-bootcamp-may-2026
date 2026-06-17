<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'monthly_limit' => 'nullable|numeric|min:0',
            'savings_target' => 'nullable|numeric|min:0',
        ]);

        $user = Auth::user();
        $user->monthly_limit = $validated['monthly_limit'] ?? null;
        $user->savings_target = $validated['savings_target'] ?? null;
        $user->save();

        return back()->with('success', 'Budget updated.');
    }
}
