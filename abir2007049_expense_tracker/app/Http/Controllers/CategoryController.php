<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())->get();
        return view('categories.index', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);
        $validated['user_id'] = Auth::id();
        Category::create($validated);
        return back()->with('success', 'Category added.');
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id()) abort(403);
        $validated = $request->validate(['name' => 'required|string|max:255','type' => 'required|in:income,expense']);
        $category->update($validated);
        return back()->with('success', 'Category updated.');
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== Auth::id()) abort(403);
        $category->delete();
        return back()->with('success', 'Category removed.');
    }
}
