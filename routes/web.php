<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuctionCRUDController;
use Stripe\Stripe;
use Stripe\Customer;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');

    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories');
    Route::get('/admin/categories/create', [CategoryController::class, 'create'])->name('admin.categories.create');
    Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::get('/admin/categories/{category}', [CategoryController::class, 'show'])->name('admin.categories.show');
    Route::get('/admin/categories/{category}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');
    Route::put('/admin/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    Route::get('/admin/auctions', [AuctionCRUDController::class, 'index'])->name('admin.auctions.index');
    Route::get('/admin/auctions/create', [AuctionCRUDController::class, 'create'])->name('admin.auctions.create');
    Route::post('/admin/auctions', [AuctionCRUDController::class, 'store'])->name('admin.auctions.store');
    Route::get('/admin/auctions/{auction}', [AuctionCRUDController::class, 'show'])->name('admin.auctions.show');
    Route::get('/admin/auctions/{auction}/edit', [AuctionCRUDController::class, 'edit'])->name('admin.auctions.edit');
    Route::put('/admin/auctions/{auction}', [AuctionCRUDController::class, 'update'])->name('admin.auctions.update');
    Route::delete('/admin/auctions/{auction}', [AuctionCRUDController::class, 'destroy'])->name('admin.auctions.destroy');
});

Route::get('/dashboard', [AuctionController::class, 'index'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/auctions/create', [AuctionController::class, 'create'])->name('auctions.create');
    Route::post('/auctions', [AuctionController::class, 'store'])->name('auctions.store');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/my-auctions', [AuctionController::class, 'myAuctions'])->name('auctions.my');
    Route::get('/cart', [AuctionController::class, 'cart'])->name('cart');
});

Route::middleware('auth')->group(function () {
    Route::get('/auctions', [AuctionController::class, 'index'])->name('auctions.index');
    Route::get('/auctions/create', [AuctionController::class, 'create'])->name('auctions.create');
    Route::post('/auctions', [AuctionController::class, 'store'])->name('auctions.store');
    Route::get('/auctions/{auction}', [AuctionController::class, 'show'])->name('auctions.show');
    Route::post('/auctions/{auction}/bid', [AuctionController::class, 'placeBid'])->name('auctions.placeBid');
});

Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
Route::post('/handle-payment', [PaymentController::class, 'handlePayment']);
Route::post('/mark-as-purchased', [CartController::class, 'markAsPurchased']);

Route::middleware('auth')->group(function () {
    Route::post('/auctions/{auction}/buy-now', [AuctionController::class, 'buyNow'])->name('auctions.buyNow');
    Route::post('/auctions/{auction}/end', [AuctionController::class, 'endAuction']);
    
});

Route::delete('/auctions/{auction}', [AuctionController::class, 'destroy'])->name('auctions.destroy');


require __DIR__.'/auth.php';
