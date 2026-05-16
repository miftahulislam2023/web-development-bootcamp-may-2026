@extends('layouts.app')

@section('title', 'Chat')

@section('content')

<div class="content flex-column-fluid" id="kt_content">

    <div class="card h-100 border-0 shadow-sm">

        {{-- Header --}}
        <div class="card-header border-0 py-4">
            <div class="d-flex align-items-center">

                <div class="symbol symbol-45px me-3">
                    <img src="{{ asset('assets/media/avatars/300-1.jpg') }}" class="rounded-circle">
                </div>

                <div>
                    <h4 class="mb-0">{{ $user->name }}</h4>
                    <span class="text-success fs-7">Online</span>
                </div>

            </div>
        </div>

        {{-- Messages --}}
        <div class="card-body overflow-auto" id="chatMessages" style="height: calc(100vh - 180px);">
            <div class="text-center text-muted p-5">No messages yet</div>
        </div>

        {{-- Send Form --}}
        <form id="chatSendForm" data-url="{{ route('message.send') }}">
            @csrf

            <div class="card-footer border-0 p-6">

                <div class="d-flex align-items-center gap-3">

                    <input type="hidden" name="receiver_id" value="{{ $user->id }}">

                    <textarea id="chatMessage" name="message" class="form-control form-control-solid" rows="1" placeholder="Type a message..."></textarea>

                    <button type="submit" id="btnSend" class="btn btn-primary px-6">
                        Send
                    </button>

                </div>

            </div>

        </form>

    </div>

</div>

@endsection


@push('scripts')

<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/laravel-echo@1.16.1/dist/echo.iife.min.js"></script>
<script>


</script>
<script>
    $(document).ready(function() {

        const authId = config.authId;
        const receiverId = config.receiverId;



        // Scroll bottom

        function scrollBottom() {
            let box = $('#chatMessages');
            box.scrollTop(box[0].scrollHeight);
        }


        // Escape HTML

        function escapeHtml(text) {
            return $('<div>').text(text || '').html();
        }


        // Render messages

        function renderMessages(messages) {

            let html = '';

            if (!messages.length) {
                html = `<div class="text-center text-muted p-5">No messages yet</div>`;
            } else {

                messages.forEach(msg => {

                    let mine = Number(msg.sender_id) === Number(authId);

                    html += `
                    <div class="d-flex mb-3 ${mine ? 'justify-content-end' : 'justify-content-start'}">
                        <div class="p-3 rounded"
                            style="max-width:300px; background:${mine ? '#d1e7dd' : '#f1f1f1'};">
                            ${escapeHtml(msg.message)}
                        </div>
                    </div>
                `;
                });
            }

            $('#chatMessages').html(html);
            scrollBottom();
        }


        // Fetch messages

        function fetchMessages() {

            $.get(`/chat/manage/fetch/${receiverId}`, function(res) {

                if (res.status) {
                    renderMessages(res.chat);
                }
            });
        }


        // Send message (FIXED)

        $('#chatSendForm').on('submit', function(e) {

            e.preventDefault();
            let message = $('#chatMessage').val().trim();
            if (!message) return;

            let url = $(this).data('url');
            let formData = new FormData(this);

            $('#btnSend').prop('disabled', true);

            $.ajax({
                url: url
                , method: 'POST'
                , data: formData
                , processData: false
                , contentType: false,

                success: function(res) {
                    if (res.status) {
                        $('#chatMessage').val('');
                        fetchMessages();
                    }
                },

                error: function(err) {
                    console.log(err);
                },

                complete: function() {
                    $('#btnSend').prop('disabled', false);
                }
            });
        });


        // Echo (safe init)

        function initEcho() {

            if (!window.Echo) return;

            try {
                window.Echo = new Echo({
                    broadcaster: 'reverb'
                    , key: '{{ config("broadcasting.connections.reverb.key") }}'
                    , wsHost: '{{ config("broadcasting.connections.reverb.options.host") }}'
                    , wsPort: {
                        {
                            config("broadcasting.connections.reverb.options.port")
                        }
                    }
                    , forceTLS: false
                    , enabledTransports: ['ws', 'wss']
                });

                window.Echo
                    .private('chat.{{ auth()->id() }}')
                    .listen('.ChatEvent', function() {
                        fetchMessages();
                    });

            } catch (e) {
                console.log('Echo init failed', e);
            }
        }

        // INIT
        fetchMessages();
        initEcho();

    });

</script>

@endpush
