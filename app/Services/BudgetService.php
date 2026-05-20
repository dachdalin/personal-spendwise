<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BudgetService
{
    /**
     * @return LengthAwarePaginator<int, Budget>
     */
    public function list(): LengthAwarePaginator
    {
        return Budget::query()
            ->with('category')
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
     * @param  array{category_id: int, amount: numeric-string|float|int, date: string}  $data
     */
    public function create(array $data): Budget
    {
        return Budget::create($data);
    }

    /**
     * @param  array{category_id: int, amount: numeric-string|float|int, date: string}  $data
     */
    public function update(Budget $budget, array $data): Budget
    {
        $budget->update($data);

        return $budget->refresh();
    }

    public function delete(Budget $budget): void
    {
        $budget->delete();
    }
}
