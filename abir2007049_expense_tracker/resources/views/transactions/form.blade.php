@extends('layouts.app')

@section('content')
<div class="col-md-8">
  <h4>{{ $transaction->exists ? 'Edit' : 'New' }} Transaction</h4>
  <form method="POST" action="{{ $transaction->exists ? route('transactions.update', $transaction) : route('transactions.store') }}">
    @csrf
    @if($transaction->exists) @method('PUT') @endif

    <div class="mb-3">
      <label>Type</label>
      <select name="type" class="form-control">
        <option value="expense" {{ old('type', $transaction->type)=='expense' ? 'selected' : '' }}>Expense</option>
        <option value="income" {{ old('type', $transaction->type)=='income' ? 'selected' : '' }}>Income</option>
      </select>
    </div>

    <div class="mb-3">
      <label>Amount</label>
      <input name="amount" class="form-control" value="{{ old('amount', $transaction->amount) }}">
    </div>

    <div class="mb-3">
      <label>Category</label>
      <select name="category_id" class="form-control">
        <option value="">— None —</option>
        @foreach($categories as $c)
          <option value="{{ $c->id }}" {{ old('category_id', $transaction->category_id)==$c->id ? 'selected' : '' }}>{{ $c->name }}</option>
        @endforeach
      </select>
    </div>

    <div class="mb-3">
      <label>Date</label>
      <input type="date" name="date" class="form-control" value="{{ old('date', $transaction->date?->format('Y-m-d') ) }}">
    </div>

    <div class="mb-3">
      <label>Note</label>
      <textarea name="note" class="form-control">{{ old('note', $transaction->note) }}</textarea>
    </div>

    <button class="btn btn-primary">Save</button>
  </form>
</div>

@endsection
