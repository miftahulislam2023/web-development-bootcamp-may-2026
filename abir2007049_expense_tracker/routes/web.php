<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return view('welcome');
});

Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.post');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('forgot-password');
Route::post('/forgot-password', [AuthController::class, 'sendPasswordReset'])->name('forgot-password.post');
Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('reset-password');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password.post');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/budget', [\App\Http\Controllers\BudgetController::class, 'update'])->name('budget.update');
    Route::post('/theme/toggle', [\App\Http\Controllers\ThemeController::class, 'toggle'])->name('theme.toggle');
    Route::resource('transactions', TransactionController::class)->except(['show']);
    Route::get('transactions-export', [\App\Http\Controllers\TransactionController::class, 'exportCsv'])->name('transactions.export');
    Route::resource('categories', CategoryController::class)->only(['index','store','update','destroy']);
});
