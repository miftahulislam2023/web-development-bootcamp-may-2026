@extends('layouts.app')

@section('content')
<div class="row g-3 mb-3">
  <div class="col-12 col-md-4">
    <div class="card stat-card p-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <div class="small-muted">Balance</div>
          <div class="h3 mt-1">${{ number_format($balance,2) }}</div>
        </div>
        <div class="text-end">
          <div class="small-muted">Net</div>
          <div class="text-success">{{ $totalIncome >= $totalExpense ? '+' : '-' }}${{ number_format(abs($totalIncome - $totalExpense),2) }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="col-6 col-md-2">
    <div class="card stat-card p-3">
      <div class="small-muted">This Month Income</div>
      <div class="h5 text-success mt-1">${{ number_format($monthlyIncome ?? 0,2) }}</div>
    </div>
  </div>

  <div class="col-6 col-md-2">
    <div class="card stat-card p-3">
      <div class="small-muted">This Month Expense</div>
      <div class="h5 text-danger mt-1">${{ number_format($monthlyExpense ?? 0,2) }}</div>
    </div>
  </div>

  <div class="col-12 col-md-4">
    <div class="card stat-card p-3">
      <div class="small-muted">Savings Rate</div>
      <div class="h5 mt-1">{{ is_null($savingsRate) ? '—' : $savingsRate.'%' }}</div>
      <div class="small-muted mt-2">Last {{ $months->count() }} months overview</div>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-md-7">
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="mb-0">Recent Transactions</h5>
        <div>
          <a href="{{ route('transactions.export') }}" class="btn btn-sm btn-outline-secondary">Export CSV</a>
        </div>
      </div>
      <table class="table mt-2">
        <thead><tr><th>Date</th><th>Note</th><th>Category</th><th>Amount</th></tr></thead>
        <tbody>
        @foreach($recent as $t)
          <tr>
            <td>{{ $t->date->format('Y-m-d') }}</td>
            <td>{{ $t->note }}</td>
            <td>{{ $t->category?->name }}</td>
            <td class="{{ $t->type=='income' ? 'text-success' : 'text-danger' }}">${{ number_format($t->amount,2) }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  </div>
  <div class="col-md-5">
    <div class="card p-3">
      <h5>Monthly Overview</h5>
      <div class="row">
        <div class="col-6">
          <canvas id="monthChart" style="height:180px"></canvas>
        </div>
        <div class="col-6">
          <canvas id="catChart" style="height:180px"></canvas>
        </div>
      </div>
      <div class="mt-3">
        @php $limit = Auth::user()->monthly_limit ?? null; @endphp
        <div class="d-flex justify-content-between small-muted mb-1"><div>Monthly budget</div><div>{{ $limit ? '$'.number_format($limit,2) : 'Not set' }}</div></div>
        <div class="d-flex justify-content-end mt-2">
          <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#budgetForm">Set Budget</button>
        </div>

        @if($limit)
          @php $usage = $monthlyExpense && $limit ? min(100, ($monthlyExpense / $limit) * 100) : 0; @endphp
          <div class="progress" style="height:10px">
            <div class="progress-bar {{ $usage > 85 ? 'bg-danger' : 'bg-success' }}" role="progressbar" style="width: {{ $usage }}%"></div>
          </div>
          <div class="small-muted mt-2">{{ number_format($monthlyExpense,2) }} spent — {{ round($usage,1) }}% of budget</div>
        @else
          <div class="small-muted">Set a monthly budget in settings to track usage.</div>
        @endif
      </div>
      <div class="collapse mt-3" id="budgetForm">
        <form method="POST" action="{{ route('budget.update') }}">
          @csrf
          <div class="row g-2">
            <div class="col-6">
              <input type="number" step="0.01" name="monthly_limit" class="form-control" placeholder="Monthly limit" value="{{ old('monthly_limit', Auth::user()->monthly_limit) }}">
            </div>
            <div class="col-6">
              <input type="number" step="0.01" name="savings_target" class="form-control" placeholder="Savings target" value="{{ old('savings_target', Auth::user()->savings_target) }}">
            </div>
            <div class="col-12 text-end mt-2">
              <button class="btn btn-primary btn-sm">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="row mt-3">
  <div class="col-md-8">
    <div class="card p-3">
      <h6>Smart Insight</h6>
      <div class="mt-2">{{ $insight ?? 'No insights right now — keep tracking to get personalized tips.' }}</div>
    </div>
  </div>
</div>

@section('scripts')
<script>
  const months = {!! json_encode($months->pluck('month')) !!};
  const incomes = {!! json_encode($months->pluck('income')) !!};
  const expenses = {!! json_encode($months->pluck('expense')) !!};
  const ctx = document.getElementById('monthChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {label: 'Income', data: incomes, backgroundColor: 'rgba(75, 192, 192, 0.6)'},
        {label: 'Expense', data: expenses, backgroundColor: 'rgba(255, 99, 132, 0.6)'}
      ]
    }
  });

  // category doughnut
  const catLabels = {!! json_encode($categoryBreakdown->map(fn($c)=> $c->category?->name ?? 'Uncategorized')) !!};
  const catValues = {!! json_encode($categoryBreakdown->pluck('total')) !!};
  const catCtx = document.getElementById('catChart');
  new Chart(catCtx, {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{ data: catValues, backgroundColor: ['#4ade80','#60a5fa','#f97316','#f87171','#a78bfa','#34d399'] }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
</script>
@endsection

@endsection
