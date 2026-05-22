<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\Api\V1\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function index(CategoryService $categories): AnonymousResourceCollection
    {
        return CategoryResource::collection($categories->list());
    }

    public function store(StoreCategoryRequest $request, CategoryService $categories): JsonResponse
    {
        $category = $categories->create($request->validated());

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category, CategoryService $categories): CategoryResource
    {
        return new CategoryResource(
            $categories->update($category, $request->validated())
        );
    }

    public function destroy(Category $category, CategoryService $categories): Response
    {
        $categories->delete($category);

        return response()->noContent();
    }
}
