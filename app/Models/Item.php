<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id',
        'name',
        'descriere',
        'image', // Adăugăm câmpul pentru imagine
    ];

    public function auction()
    {
        return $this->hasOne(Auction::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
