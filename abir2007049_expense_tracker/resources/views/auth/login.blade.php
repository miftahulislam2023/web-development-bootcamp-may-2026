@extends('layouts.auth')

@section('page-title', 'Login')
@section('page-subtitle', 'Access your expense tracker account')

@section('auth-content')
<form method="POST" action="{{ route('login.post') }}">
    @csrf
    
    <div class="form-group">
        <label for="email">Email Address</label>
        <input id="email" name="email" type="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email') }}" required autofocus>
        @error('email')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>

    <div class="form-group">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" class="form-control @error('password') is-invalid @enderror" required>
        @error('password')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>

    <div class="forgot-password-link">
        <a href="{{ route('forgot-password') }}" class="auth-link">Forgot password?</a>
    </div>

    <button type="submit" class="btn-primary-auth">Login to Account</button>

    <div class="register-link-wrapper">
        <p>Don't have an account? <a href="{{ route('register') }}" class="auth-link" style="display: inline;">Sign up here</a></p>
    </div>
</form>
@endsection
