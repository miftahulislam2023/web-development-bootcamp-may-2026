@extends('layouts.guest')

@section('content')

<div class="container-fluid min-vh-100 overflow-hidden">
    <div class="row min-vh-100">

        {{-- Left Side --}}
        <div class="col-lg-6 d-none d-lg-flex auth-left align-items-center justify-content-center">
            <div class="text-center px-5">
                <h1 class="display-4 fw-bold mb-4">Create Account 🚀</h1>

                <p class="fs-5 opacity-75">
                    Join our real-time chat platform
                    and start conversations instantly.
                </p>
            </div>
        </div>

        {{-- Right Side --}}
        <div class="col-lg-6 d-flex align-items-center justify-content-center">

            <div class="w-100" style="max-width:450px;">

                {{-- Logo --}}
                <div class="text-center mb-5">
                    <a href="{{ url('/') }}" class="text-decoration-none">
                        <h2 class="brand text-primary">
                            💬 ChatApp
                        </h2>
                    </a>
                </div>

                <div class="card auth-card shadow-lg">
                    <div class="card-body p-5">

                        <h3 class="fw-bold text-center mb-4">
                            Create Account
                        </h3>

                        <form method="POST" action="{{ route('register') }}">
                            @csrf

                            {{-- Name --}}
                            <div class="mb-4">
                                <label class="form-label fw-semibold">
                                    Full Name
                                </label>

                                <input type="text" name="name" value="{{ old('name') }}" class="form-control @error('name') is-invalid @enderror" placeholder="Enter your name" required autofocus>

                                @error('name')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                                @enderror
                            </div>

                            {{-- Email --}}
                            <div class="mb-4">
                                <label class="form-label fw-semibold">
                                    Email Address
                                </label>

                                <input type="email" name="email" value="{{ old('email') }}" class="form-control @error('email') is-invalid @enderror" placeholder="Enter your email" required>

                                @error('email')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                                @enderror
                            </div>

                            {{-- Password --}}
                            <div class="mb-4">
                                <label class="form-label fw-semibold">
                                    Password
                                </label>

                                <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" placeholder="Create password" required>

                                @error('password')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                                @enderror
                            </div>

                            {{-- Confirm Password --}}
                            <div class="mb-4">
                                <label class="form-label fw-semibold">
                                    Confirm Password
                                </label>

                                <input type="password" name="password_confirmation" class="form-control @error('password_confirmation') is-invalid @enderror" placeholder="Confirm password" required>

                                @error('password_confirmation')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                                @enderror
                            </div>

                            {{-- Submit --}}
                            <button type="submit" class="btn btn-primary w-100">
                                Create Account
                            </button>

                            {{-- Login Link --}}
                            <div class="text-center mt-4">
                                Already have an account?

                                <a href="{{ route('login') }}" class="text-primary fw-bold text-decoration-none">
                                    Login
                                </a>
                            </div>

                        </form>

                    </div>
                </div>

                {{-- Footer --}}
                <p class="text-center text-muted mt-4 small">
                    © {{ date('Y') }} ChatApp
                </p>

            </div>

        </div>

    </div>
</div>

@endsection
