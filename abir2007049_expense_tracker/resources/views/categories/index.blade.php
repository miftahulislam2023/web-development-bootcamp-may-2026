@extends('layouts.app')

@section('content')
<div class="row">
  <div class="col-md-6">
    <h4>Categories</h4>
    <form method="POST" action="{{ route('categories.store') }}" class="d-flex gap-2 mb-3">@csrf
      <input name="name" class="form-control" placeholder="New category">
      <select name="type" class="form-control" style="max-width:160px">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button class="btn btn-primary">Add</button>
    </form>

    <ul class="list-group">
      @foreach($categories as $c)
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ $c->name }}</strong>
            <span class="badge bg-{{ $c->type=='income' ? 'success' : 'secondary' }} ms-2">{{ ucfirst($c->type) }}</span>
          </div>
          <form method="POST" action="{{ route('categories.destroy', $c) }}">@csrf @method('DELETE')<button class="btn btn-sm btn-outline-danger">Delete</button></form>
        </li>
      @endforeach
    </ul>
  </div>
</div>

@endsection
