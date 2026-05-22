<?php
namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ChatEvent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels, InteractsWithSockets;

    public $chat;

    public function __construct(Message $chat)
    {

        $this->chat = $chat;
    }

    public function broadcastOn()
    {
        Log::info('enter broadcast: ' . $this->chat->conversation_id);

        return new PrivateChannel('chat-conversation.' . $this->chat->conversation_id);
    }

    public function broadcastAs()
    {
        return 'ChatEvent';
    }

    public function broadcastWith()
    {
        return [
            'message' => [
                'id'              => $this->chat->id,
                'message'         => $this->chat->message,
                'sender_id'       => $this->chat->sender_id,
                'receiver_id'     => $this->chat->receiver_id,
                'conversation_id' => $this->chat->conversation_id,
            ],
        ];
    }
}
