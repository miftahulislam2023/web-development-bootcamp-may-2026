<?php

use App\Models\Message;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-conversation.{conversationId}', function ($user, $conversationId) {
    $conversationId = trim((string) $conversationId);

    if ($conversationId === '') {
        return false;
    }

    $participants = array_map('intval', explode('-', $conversationId));

    if (count($participants) === 2 && in_array((int) $user->id, $participants, true)) {
        return true;
    }

    return Message::where('conversation_id', $conversationId)
        ->where(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id);
        })
        ->exists();
});
