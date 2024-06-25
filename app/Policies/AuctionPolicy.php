<?php

namespace App\Policies;

use App\Models\Auction;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;


class AuctionPolicy
{
   

    /**
     * Determine whether the user can delete the auction.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Auction  $auction
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Auction $auction)
    {
        // Doar utilizatorul care a creat licitația o poate șterge
        return $user->id === $auction->user_id;
    }

    
}
