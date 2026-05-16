<?php
namespace App\Http\Controllers\Message;

use App\Events\ChatEvent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{

    public function user(Request $request, $userId)
    {
        $user = User::where('id', $userId)->first();
        return view('chat.index', compact('user'));
    }
    //message store and event dispatch

    public function sendMessage(Request $request)
    {
        try {
            $receiverId = $request->receiver_id;

            $conversationId = implode('-', [
                min(Auth::id(), $receiverId),
                max(Auth::id(), $receiverId),
            ]);

            $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'message'     => 'required',
            ]);

            $message = Message::create([
                'sender_id'       => Auth::id(),
                'receiver_id'     => $request->receiver_id,
                'conversation_id' => $conversationId,
                'message'         => $request->message,
            ]);

            broadcast(new ChatEvent($message))->toOthers();

            Log::info('Message sent', ['message' => $message]);
        } catch (\Exception $e) {

            return response()->json([
                'error' => $e->getMessage(),
                'line'  => $e->getLine(),
                'file'  => $e->getFile(),
            ]);
        }
    }
}
