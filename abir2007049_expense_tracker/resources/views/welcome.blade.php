<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Expense Tracker') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet">
    <style>
        body.welcome-page {
            min-height: 100vh;
            background:
                radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 30%),
                radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.10), transparent 24%),
                #f5f7fb;
        }

        .welcome-shell {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .welcome-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 0 10px;
        }

        .brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            letter-spacing: -0.03em;
            color: #0f172a;
            text-decoration: none;
        }

        .brand-badge {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
        }

        .hero-card {
            margin: auto 0;
            background: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(148, 163, 184, 0.20);
            border-radius: 28px;
            box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
            overflow: hidden;
        }

        .hero-copy { padding: 36px; }

        .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 12px;
            border-radius: 999px;
            background: #eef2ff;
            color: #334155;
            font-size: 13px;
            font-weight: 600;
        }

        h1 {
            margin: 18px 0 12px;
            font-size: clamp(2.2rem, 5vw, 4rem);
            line-height: 0.98;
            letter-spacing: -0.05em;
            color: #0f172a;
        }

        .lead {
            color: #64748b;
            font-size: 1.02rem;
            line-height: 1.75;
            max-width: 56ch;
        }

        .action-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 24px;
        }

        .btn-soft {
            border: 1px solid rgba(148, 163, 184, 0.28);
            background: rgba(255,255,255,0.85);
            color: #0f172a;
            border-radius: 14px;
            padding: 12px 18px;
            font-weight: 700;
            text-decoration: none;
            transition: transform .18s ease, box-shadow .18s ease;
        }

        .btn-soft:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .btn-primary-soft {
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            color: #fff;
            box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
            border: none;
        }

        .feature-list {
            display: grid;
            gap: 12px;
            margin: 24px 0 0;
            padding: 0;
            list-style: none;
        }

        .feature-list li {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            color: #334155;
            font-size: 14px;
        }

        .dot {
            width: 10px;
            height: 10px;
            margin-top: 6px;
            border-radius: 999px;
            background: #10b981;
            box-shadow: 0 0 0 6px rgba(16,185,129,0.10);
            flex: 0 0 auto;
        }

        .hero-preview {
            height: 100%;
            padding: 28px;
            background: linear-gradient(160deg, #0f172a, #111827);
            color: #e2e8f0;
        }

        .mini-card {
            padding: 16px;
            border-radius: 18px;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(148, 163, 184, 0.16);
        }

        .mini-label { color: #94a3b8; font-size: 13px; }
        .mini-value { margin-top: 8px; font-size: 1.3rem; font-weight: 800; }

        .preview-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .progress-wrap {
            margin-top: 18px;
            padding: 16px;
            border-radius: 18px;
            background: rgba(255,255,255,0.05);
        }

        .progress {
            margin-top: 10px;
            height: 10px;
            border-radius: 999px;
            background: rgba(255,255,255,0.10);
            overflow: hidden;
        }

        .progress span {
            display: block;
            width: 67%;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #22c55e, #60a5fa);
        }

        @media (max-width: 992px) {
            .welcome-nav { padding-top: 18px; }
            .hero-copy, .hero-preview { padding: 24px; }
        }

        @media (max-width: 640px) {
            .hero-copy, .hero-preview { padding: 20px; }
            .preview-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body class="welcome-page">
<div class="container welcome-shell">
    <div class="welcome-nav">
        <a href="{{ url('/') }}" class="brand">
            <span class="brand-badge"></span>
            <span>ExpenseTracker</span>
        </a>
    </div>

    <div class="hero-card row g-0">
        <div class="col-lg-7 hero-copy">
            <div class="eyebrow">Fintech-style expense tracker</div>
            <h1>Simple money tracking with a polished product feel.</h1>
            <p class="lead">
                A clean personal finance dashboard for income, expenses, budgets, and monthly insights. Built to look like a real startup MVP without extra clutter.
            </p>

            <ul class="feature-list">
                <li><span class="dot"></span><span>Fast login and registration for quick access</span></li>
                <li><span class="dot"></span><span>Budget tracking, monthly summaries, and charts</span></li>
                <li><span class="dot"></span><span>Readable layout that matches the app's dashboard design</span></li>
            </ul>

            <div class="action-row">
                <a href="{{ route('login') }}" class="btn-soft btn-primary-soft">Login</a>
                <a href="{{ route('register') }}" class="btn-soft">Create account</a>
            </div>
        </div>

        <div class="col-lg-5 hero-preview">
            <div class="preview-grid">
                <div class="mini-card">
                    <div class="mini-label">Balance</div>
                    <div class="mini-value">$4,280</div>
                </div>
                <div class="mini-card">
                    <div class="mini-label">Savings Rate</div>
                    <div class="mini-value">18.4%</div>
                </div>
                <div class="mini-card">
                    <div class="mini-label">Income</div>
                    <div class="mini-value" style="color:#4ade80">$6,500</div>
                </div>
                <div class="mini-card">
                    <div class="mini-label">Expense</div>
                    <div class="mini-value" style="color:#f87171">$2,220</div>
                </div>
            </div>

            <div class="progress-wrap mt-3">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>This month budget</strong>
                    <span>$2,220 / $3,000</span>
                </div>
                <div class="progress"><span></span></div>
                <div class="d-flex justify-content-between align-items-center mt-3" style="color:#cbd5e1; font-size:14px;">
                    <span>Good Evening, Abir 👋</span>
                    <span style="color:#86efac;">Healthy</span>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
