<div class="sidebar bg-white shadow-sm vh-100 p-3">
  <a class="d-flex align-items-center mb-3 text-decoration-none" href="{{ route('dashboard') }}">
    <span class="fs-4">ExpenseTracker</span>
  </a>

  <ul class="nav nav-pills flex-column mb-4">
    <li class="nav-item"><a href="{{ route('dashboard') }}" class="nav-link">Dashboard</a></li>
    <li class="nav-item"><a href="{{ route('transactions.index') }}" class="nav-link">Transactions</a></li>
    <li class="nav-item"><a href="{{ route('categories.index') }}" class="nav-link">Categories</a></li>
  </ul>

  <div class="border-top pt-3">
    <form method="POST" action="{{ route('theme.toggle') }}" class="d-flex gap-2">@csrf
      <button class="btn btn-sm btn-outline-secondary flex-grow-1">
        {{ Auth::user()->theme === 'dark' ? '☀️ Light' : '🌙 Dark' }}
      </button>
    </form>
  </div>
</div>
