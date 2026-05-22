<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Http\Resources\Api\V1\BudgetResource;
use App\Models\Budget;
use App\Services\BudgetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class BudgetController extends Controller
{
    public function index(BudgetService $budgets): AnonymousResourceCollection
    {
        return BudgetResource::collection($budgets->list());
    }

    public function store(StoreBudgetRequest $request, BudgetService $budgets): JsonResponse
    {
        $budget = $budgets->create($request->validated())->load('category');

        return (new BudgetResource($budget))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Budget $budget): BudgetResource
    {
        return new BudgetResource($budget->load('category'));
    }

    public function update(UpdateBudgetRequest $request, Budget $budget, BudgetService $budgets): BudgetResource
    {
        return new BudgetResource(
            $budgets->update($budget, $request->validated())->load('category')
        );
    }

    public function destroy(Budget $budget, BudgetService $budgets): Response
    {
        $budgets->delete($budget);

        return response()->noContent();
    }
}
