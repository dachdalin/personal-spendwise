<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(TransactionService $transactions): Response
    {
        return Inertia::render('transactions/index', [
            'transactions' => $transactions->list(),
            'categories' => $transactions->categories(),
            'budgets' => $transactions->budgets(),
        ]);
    }

    public function create(TransactionService $transactions): Response
    {
        return Inertia::render('transactions/create', [
            'categories' => $transactions->categories(),
            'budgets' => $transactions->budgets(),
        ]);
    }

    public function store(StoreTransactionRequest $request, TransactionService $transactions): RedirectResponse
    {
        $transaction = $transactions->create($request->validated(), $request->user());

        return to_route('transactions.show', $transaction);
    }

    public function show(Transaction $transaction): Response
    {
        return Inertia::render('transactions/show', [
            'transaction' => $transaction->load(['category', 'budget.category', 'user']),
        ]);
    }

    public function edit(Transaction $transaction, TransactionService $transactions): Response
    {
        return Inertia::render('transactions/edit', [
            'transaction' => $transaction->load(['category', 'budget.category', 'user']),
            'categories' => $transactions->categories(),
            'budgets' => $transactions->budgets(),
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction, TransactionService $transactions): RedirectResponse
    {
        $transaction = $transactions->update($transaction, $request->validated());

        return to_route('transactions.show', $transaction);
    }

    public function destroy(Transaction $transaction, TransactionService $transactions): RedirectResponse
    {
        $transactions->delete($transaction);

        return to_route('transactions.index');
    }
}
