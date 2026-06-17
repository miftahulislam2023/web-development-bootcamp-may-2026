<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ThemeController extends Controller
{
    public function toggle(Request $request)
    {
        $user = Auth::user();
        $user->theme = $user->theme === 'light' ? 'dark' : 'light';
        $user->save();

        return back();
    }
}
