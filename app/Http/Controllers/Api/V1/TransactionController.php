<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\Api\V1\TransactionResource;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class TransactionController extends Controller
{
    public function index(TransactionService $transactions): AnonymousResourceCollection
    {
        return TransactionResource::collection($transactions->list());
    }

    public function store(StoreTransactionRequest $request, TransactionService $transactions): JsonResponse
    {
        $transaction = $transactions->create($request->validated(), $request->user())
            ->load(['category', 'budget.category', 'user']);

        return (new TransactionResource($transaction))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Transaction $transaction): TransactionResource
    {
        return new TransactionResource($transaction->load(['category', 'budget.category', 'user']));
    }

    public function update(
        UpdateTransactionRequest $request,
        Transaction $transaction,
        TransactionService $transactions
    ): TransactionResource {
        $transaction = $transactions->update($transaction, $request->validated())
            ->load(['category', 'budget.category', 'user']);

        return new TransactionResource($transaction);
    }

    public function destroy(Transaction $transaction, TransactionService $transactions): Response
    {
        $transactions->delete($transaction);

        return response()->noContent();
    }
}
