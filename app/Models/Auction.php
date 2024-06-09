<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Auction extends Model
{
    use HasFactory;
    protected $fillable = [
        'start_time',
        'end_time',
        'pret_start',
        'buy_now',
        'user_id',
        'item_id',
        'status', // Adăugăm câmpul status
    ];

    protected $dates = ['start_time', 'end_time'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);

    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }
    public function getTimeLeftAttribute()
    {
        $current_time = Carbon::now();
        $end_time = Carbon::parse($this->end_time);
        $time_left = $end_time->diffInSeconds($current_time);
        return $time_left > 0 ? $time_left : 0;
    }
    

}
