@extends('layouts.auth')

@section('page-title', 'Reset Password')
@section('page-subtitle', 'We\'ll send you a link to reset your password')

@section('auth-content')
<form method="POST" action="{{ route('forgot-password.post') }}">
    @csrf
    
    <div class="form-group">
        <label for="email">Email Address</label>
        <input id="email" name="email" type="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email') }}" required autofocus>
        @error('email')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>

    <button type="submit" class="btn-primary-auth">Send Reset Link</button>

    <div style="text-align: center;">
        <a href="{{ route('login') }}" class="auth-link">Back to Login</a>
    </div>
</form>
@endsection
