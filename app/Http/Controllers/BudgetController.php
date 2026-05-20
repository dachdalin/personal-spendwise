<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Models\Budget;
use App\Services\BudgetService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(BudgetService $budgets): Response
    {
        return Inertia::render('budgets/index', [
            'budgets' => $budgets->list(),
            'categories' => $budgets->categories(),
        ]);
    }

    public function create(BudgetService $budgets): Response
    {
        return Inertia::render('budgets/create', [
            'categories' => $budgets->categories(),
        ]);
    }

    public function store(StoreBudgetRequest $request, BudgetService $budgets): RedirectResponse
    {
        $budget = $budgets->create($request->validated());

        return to_route('budgets.show', $budget);
    }

    public function show(Budget $budget): Response
    {
        return Inertia::render('budgets/show', [
            'budget' => $budget->load('category'),
        ]);
    }

    public function edit(Budget $budget, BudgetService $budgets): Response
    {
        return Inertia::render('budgets/edit', [
            'budget' => $budget->load('category'),
            'categories' => $budgets->categories(),
        ]);
    }

    public function update(UpdateBudgetRequest $request, Budget $budget, BudgetService $budgets): RedirectResponse
    {
        $budget = $budgets->update($budget, $request->validated());

        return to_route('budgets.show', $budget);
    }

    public function destroy(Budget $budget, BudgetService $budgets): RedirectResponse
    {
        $budgets->delete($budget);

        return to_route('budgets.index');
    }
}
