<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TransactionService
{
    /**
     * @return LengthAwarePaginator<int, Transaction>
     */
    public function list(): LengthAwarePaginator
    {
        return Transaction::query()
            ->with(['category', 'budget.category', 'user'])
            ->latest('date')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * @return Collection<int, Category>
     */
    public function categories(): Collection
    {
        return Category::query()
            ->select(['id', 'name', 'icon', 'color'])
            ->orderBy('name')
            ->get();
    }

    /**
     * @return Collection<int, Budget>
     */
    public function budgets(): Collection
    {
        return Budget::query()
            ->with('category')
            ->orderByDesc('date')
            ->get();
    }

    /**
     * @param  array{title: string, category_id: int, budget_id: int, amount: numeric-string|float|int, description?: string|null, type: 'expense'|'income', date: string}  $data
     */
    public function create(array $data, User $user): Transaction
    {
        return Transaction::create([
            ...$data,
            'user_id' => $user->id,
        ]);
    }

    /**
     * @param  array{title: string, category_id: int, budget_id: int, amount: numeric-string|float|int, description?: string|null, type: 'expense'|'income', date: string}  $data
     */
    public function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);

        return $transaction->refresh();
    }

    public function delete(Transaction $transaction): void
    {
        $transaction->delete();
    }
}
