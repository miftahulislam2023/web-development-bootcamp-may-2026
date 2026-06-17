<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Expense Tracker') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet">
    <style>
        * {
            font-family: 'Inter', sans-serif;
        }

        body {
            min-height: 100vh;
            background:
                radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 40%),
                radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.08), transparent 40%),
                #f5f7fb;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .auth-container {
            width: 100%;
            max-width: 420px;
            padding: 20px;
        }

        .auth-card {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(148, 163, 184, 0.12);
        }

        .auth-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .brand-logo {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
            text-decoration: none;
            color: #0f172a;
        }

        .brand-badge {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            box-shadow: 0 8px 16px rgba(37, 99, 235, 0.25);
        }

        .brand-name {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.03em;
        }

        .auth-title {
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 8px;
        }

        .auth-subtitle {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 0;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #0f172a;
            margin-bottom: 8px;
        }

        .form-control {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 14px;
            transition: all 0.2s;
        }

        .form-control:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .btn-primary-auth {
            width: 100%;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            border: none;
            border-radius: 8px;
            padding: 10px;
            font-size: 14px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 16px;
        }

        .btn-primary-auth:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
        }

        .auth-link {
            display: block;
            text-align: center;
            font-size: 14px;
            color: #2563eb;
            text-decoration: none;
            transition: color 0.2s;
        }

        .auth-link:hover {
            color: #1d4ed8;
            text-decoration: underline;
        }

        .forgot-password-link {
            font-size: 13px;
            text-align: right;
            margin-bottom: 20px;
        }

        .divider {
            text-align: center;
            margin: 24px 0;
            font-size: 13px;
            color: #94a3b8;
        }

        .divider::before {
            content: '';
            display: block;
            height: 1px;
            background: #e2e8f0;
            margin-bottom: 12px;
        }

        .divider::after {
            content: '';
            display: block;
            height: 1px;
            background: #e2e8f0;
            margin-top: 12px;
        }

        .register-link-wrapper {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }

        .register-link-wrapper p {
            font-size: 14px;
            color: #64748b;
            margin: 0;
        }

        .alert {
            border-radius: 8px;
            border: 1px solid;
            padding: 12px 16px;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .alert-danger {
            background-color: #fee2e2;
            border-color: #fca5a5;
            color: #991b1b;
        }

        .alert-success {
            background-color: #dcfce7;
            border-color: #86efac;
            color: #166534;
        }

        .invalid-feedback {
            display: block;
            font-size: 12px;
            color: #dc2626;
            margin-top: 6px;
        }

        .is-invalid {
            border-color: #fca5a5 !important;
        }

        @media (max-width: 640px) {
            .auth-card {
                padding: 28px 20px;
            }

            .auth-title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <a href="{{ url('/') }}" class="brand-logo">
                <span class="brand-badge"></span>
                <span class="brand-name">ExpenseTracker</span>
            </a>
            <h1 class="auth-title">@yield('page-title', 'Welcome')</h1>
            <p class="auth-subtitle">@yield('page-subtitle')</p>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger">
                {{ $errors->first() }}
            </div>
        @endif

        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

        @yield('auth-content')
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
