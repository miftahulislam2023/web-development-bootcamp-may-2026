@extends('layouts.auth')

@section('page-title', 'Create Account')
@section('page-subtitle', 'Join ExpenseTracker today')

@section('auth-content')
<form method="POST" action="{{ route('register.post') }}">
    @csrf
    
    <div class="form-group">
        <label for="name">Full Name</label>
        <input id="name" name="name" type="text" class="form-control @error('name') is-invalid @enderror" value="{{ old('name') }}" required autofocus>
        @error('name')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>

    <div class="form-group">
        <label for="email">Email Address</label>
        <input id="email" name="email" type="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email') }}" required>
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

    <div class="form-group">
        <label for="password_confirmation">Confirm Password</label>
        <input id="password_confirmation" name="password_confirmation" type="password" class="form-control" required>
    </div>

    <button type="submit" class="btn-primary-auth">Create Account</button>

    <div class="register-link-wrapper">
        <p>Already have an account? <a href="{{ route('login') }}" class="auth-link" style="display: inline;">Sign in here</a></p>
    </div>
</form>
@endsection
