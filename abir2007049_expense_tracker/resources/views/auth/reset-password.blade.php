@extends('layouts.auth')

@section('page-title', 'Create New Password')
@section('page-subtitle', 'Enter your new password below')

@section('auth-content')
<form method="POST" action="{{ route('reset-password.post') }}">
    @csrf
    <input type="hidden" name="token" value="{{ $token }}">
    
    <div class="form-group">
        <label for="email">Email Address</label>
        <input id="email" name="email" type="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email', $email) }}" required>
        @error('email')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    
    <div class="form-group">
        <label for="password">New Password</label>
        <input id="password" name="password" type="password" class="form-control @error('password') is-invalid @enderror" required autofocus>
        @error('password')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    
    <div class="form-group">
        <label for="password_confirmation">Confirm Password</label>
        <input id="password_confirmation" name="password_confirmation" type="password" class="form-control" required>
    </div>
    
    <button type="submit" class="btn-primary-auth">Reset Password</button>

    <div style="text-align: center;">
        <a href="{{ route('login') }}" class="auth-link">Back to Login</a>
    </div>
</form>
@endsection
