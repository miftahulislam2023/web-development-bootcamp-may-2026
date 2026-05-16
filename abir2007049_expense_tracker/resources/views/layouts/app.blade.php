<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Expense Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="theme-{{ Auth::check() ? Auth::user()->theme : 'light' }}">

<div class="container-fluid">
  <div class="row">
    <div class="col-auto d-none d-md-block p-0">
      @auth
        @include('partials.sidebar')
      @endauth
    </div>
    <div class="col ps-4">
      <nav class="navbar navbar-expand-lg navbar-light bg-transparent px-0">
        <div class="container-fluid px-0">
          <div class="d-flex ms-auto align-items-center gap-3">
            @auth
            @php
              $hour = now()->hour;
              if ($hour < 12) $greeting = 'Good morning';
              elseif ($hour < 18) $greeting = 'Good afternoon';
              else $greeting = 'Good evening';
            @endphp
            <div class="small-muted d-none d-md-block">{{ $greeting }}, <strong>{{ Auth::user()->name }}</strong> 👋</div>

            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Profile
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li>
                  <form method="POST" action="{{ route('logout') }}">@csrf
                    <button class="dropdown-item">Logout</button>
                  </form>
                </li>
              </ul>
            </div>
            @else
            <a class="btn btn-outline-primary btn-sm" href="{{ route('login') }}">Login</a>
            @endauth
          </div>
        </div>
      </nav>

      @if(session('success'))
          <div class="alert alert-success">{{ session('success') }}</div>
      @endif

      @yield('content')
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
@yield('scripts')
</body>
</html>
