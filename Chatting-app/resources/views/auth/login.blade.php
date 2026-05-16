@extends('layouts.guest')

@section('content')

<div class="container-fluid vh-100">
    <div class="row min-vh-100">


        {{-- Left Side --}}
        <div class="col-lg-6 d-none d-lg-flex bg-primary text-white justify-content-center align-items-center">
            <div class="text-center">
                <h1 class="fw-bold display-5">Welcome Back</h1>
                <p class="lead mt-3">
                    Sign in and start chatting with your friends.
                </p>
            </div>
        </div>

        {{-- Right Side --}}
        <div class="col-lg-6 d-flex justify-content-center align-items-center">

            <div style="width:100%; max-width:400px;">

                <div class="text-center mb-5">
                    <a href="{{ url('/') }}" class="text-decoration-none">
                        <h2 class="brand text-primary">
                            💬 ChatApp
                        </h2>
                    </a>
                </div>


                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">

                        <h4 class="text-center mb-4">Login</h4>

                        @if(session('status'))
                        <div class="alert alert-success">
                            {{ session('status') }}
                        </div>
                        @endif

                        <form method="POST" action="{{ route('login') }}">
                            @csrf

                            {{-- Email --}}
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" value="{{ old('email') }}" class="form-control @error('email') is-invalid @enderror" required>
                                @error('email')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                                @enderror
                            </div>

                            {{-- Password --}}
                            <div class="mb-3">
                                <div class="d-flex justify-content-between">
                                    <label class="form-label">Password</label>

                                    @if (Route::has('password.request'))
                                    <a href="{{ route('password.request') }}" class="small text-decoration-none">
                                        Forgot?
                                    </a>
                                    @endif
                                </div>

                                <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" required>

                                @error('password')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                                @enderror
                            </div>

                            {{-- Remember --}}
                            <div class="form-check mb-3">
                                <input type="checkbox" name="remember" class="form-check-input" id="remember">
                                <label class="form-check-label" for="remember">
                                    Remember me
                                </label>
                            </div>

                            {{-- Button --}}
                            <button class="btn btn-primary w-100">
                                Login
                            </button>

                            {{-- Register --}}
                            <div class="text-center mt-3">
                                Don't have an account?
                                <a href="{{ route('register') }}" class="text-decoration-none">
                                    Register
                                </a>
                            </div>

                        </form>

                    </div>
                </div>

            </div>

        </div>

    </div>
</div>

@endsection
