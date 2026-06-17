@extends('layouts.app')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
  <h4>Transactions</h4>
  <a class="btn btn-primary" href="{{ route('transactions.create') }}">Add Transaction</a>
</div>

<form method="GET" class="row g-2 mb-3">
  <div class="col-auto">
    <input type="text" name="q" value="{{ request('q') }}" class="form-control" placeholder="Search description">
  </div>
  <div class="col-auto">
    <select name="category" class="form-control">
      <option value="">All categories</option>
      @foreach($categories as $c)
        <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->name }}</option>
      @endforeach
    </select>
  </div>
  <div class="col-auto">
    <select name="type" class="form-control">
      <option value="">Any type</option>
      <option value="income" {{ request('type')=='income' ? 'selected' : '' }}>Income</option>
      <option value="expense" {{ request('type')=='expense' ? 'selected' : '' }}>Expense</option>
    </select>
  </div>
  <div class="col-auto">
    <input type="date" name="from" value="{{ request('from') }}" class="form-control">
  </div>
  <div class="col-auto">
    <input type="date" name="to" value="{{ request('to') }}" class="form-control">
  </div>
  <div class="col-auto">
    <button class="btn btn-outline-secondary">Filter</button>
  </div>
</form>

<table class="table">
  <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th></th></tr></thead>
  <tbody>
    @foreach($transactions as $t)
      <tr>
        <td>{{ $t->date->format('Y-m-d') }}</td>
        <td>{{ ucfirst($t->type) }}</td>
        <td>{{ $t->category?->name }}</td>
        <td class="{{ $t->type=='income' ? 'text-success' : 'text-danger' }}">${{ number_format($t->amount,2) }}</td>
        <td>
          <a href="{{ route('transactions.edit', $t) }}" class="btn btn-sm btn-outline-secondary">Edit</a>
          <form method="POST" action="{{ route('transactions.destroy', $t) }}" style="display:inline">@csrf @method('DELETE')<button class="btn btn-sm btn-outline-danger">Delete</button></form>
        </td>
      </tr>
    @endforeach
  </tbody>
</table>

{{ $transactions->links() }}

@endsection
