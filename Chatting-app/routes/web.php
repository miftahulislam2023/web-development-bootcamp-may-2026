<?php

use App\Http\Controllers\Message\MessageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    //profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //message route
    Route::get('/chat/{userId}', [MessageController::class, 'user'])->name('chat.index');
    Route::post('/send-message', [MessageController::class, 'sendMessage'])->name('message.send');

});

require __DIR__ . '/auth.php';
