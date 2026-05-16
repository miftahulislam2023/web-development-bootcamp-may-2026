<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (! $user) return;

        $categories = [
            ['name' => 'Salary', 'type' => 'income'],
            ['name' => 'Freelance', 'type' => 'income'],
            ['name' => 'Food', 'type' => 'expense'],
            ['name' => 'Transport', 'type' => 'expense'],
            ['name' => 'Rent', 'type' => 'expense'],
            ['name' => 'Entertainment', 'type' => 'expense'],
        ];

        foreach ($categories as $c) {
            Category::firstOrCreate(['user_id' => $user->id, 'name' => $c['name']], ['type' => $c['type']]);
        }

        $cats = Category::where('user_id', $user->id)->get()->keyBy('name');

        // create transactions over last 6 months
        $today = Carbon::now();
        for ($m = 0; $m < 120; $m += 7) {
            $date = $today->copy()->subDays($m);
            // income occasionally
            if ($date->day % 10 == 0) {
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'income',
                    'category_id' => $cats['Salary']->id ?? null,
                    'amount' => rand(800, 1500),
                    'note' => 'Monthly salary',
                    'date' => $date->toDateString(),
                ]);
            }

            // expenses
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'expense',
                'category_id' => $cats['Food']->id ?? null,
                'amount' => rand(5, 50),
                'note' => 'Groceries',
                'date' => $date->toDateString(),
            ]);

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'expense',
                'category_id' => $cats['Transport']->id ?? null,
                'amount' => rand(2, 20),
                'note' => 'Transport',
                'date' => $date->toDateString(),
            ]);
        }
    }
}
