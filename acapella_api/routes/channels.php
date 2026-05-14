<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels — Reverb (WebSockets)
|--------------------------------------------------------------------------
|
| Private user channel: `private-user.{id}`
| Authorised by Sanctum — the user must match the channel ID.
| Flutter uses: PusherChannels.subscribe('private-user.{userId}')
| React uses:   echo.private(`user.${userId}`)
|
*/

Broadcast::channel('user.{id}', function ($user, $id) {
    // Only the authenticated user can subscribe to their own private channel
    return (int) $user->id === (int) $id;
});
