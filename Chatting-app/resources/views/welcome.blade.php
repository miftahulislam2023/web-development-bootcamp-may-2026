{{-- resources/views/welcome.blade.php --}}

@extends('layouts.guest')

@section('content')

<div class="container-fluid">

    {{-- Hero Section --}}
    <div class="row min-vh-100 align-items-center">

        {{-- Left Content --}}
        <div class="col-lg-6 px-5 py-5">

            <div style="max-width: 600px;">

                <span class="badge bg-primary-subtle text-primary px-3 py-2 mb-4">
                    Real-Time Messaging Platform
                </span>

                <h1 class="display-3 fw-bold text-dark mb-4">
                    Connect & Chat
                    <span class="text-primary">
                        Instantly
                    </span>
                </h1>

                <p class="fs-5 text-muted mb-5">
                    A modern real-time chat application built with Laravel.
                    Secure messaging, fast communication, and clean experience.
                </p>

                <div class="d-flex gap-3 flex-wrap">

                    @auth
                    <a href="{{ route('chat.index') }}" class="btn btn-primary btn-lg px-5">
                        Open Chat
                    </a>
                    @else
                    <a href="{{ route('login') }}" class="btn btn-primary btn-lg px-5">
                        Login
                    </a>

                    <a href="{{ route('register') }}" class="btn btn-outline-primary btn-lg px-5">
                        Register
                    </a>
                    @endauth

                </div>

                {{-- Features --}}
                <div class="row mt-5 g-4">

                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold">⚡ Fast</h5>

                                <p class="text-muted small mb-0">
                                    Real-time instant messaging experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold">🔒 Secure</h5>

                                <p class="text-muted small mb-0">
                                    Authentication and protected chats.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold">💬 Modern</h5>

                                <p class="text-muted small mb-0">
                                    Clean UI with responsive experience.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>

        {{-- Right Side --}}
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">

            <div class="text-center">

                <div class="bg-white shadow-lg rounded-4 p-5">

                    <div class="display-1 mb-4">
                        💬
                    </div>

                    <h2 class="fw-bold mb-3">
                        Chat Anytime
                    </h2>

                    <p class="text-muted fs-5 mb-0">
                        Message your friends and teammates in real time.
                    </p>

                </div>

            </div>

        </div>

    </div>

</div>

@endsection
