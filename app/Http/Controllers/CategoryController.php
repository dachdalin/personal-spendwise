<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(CategoryService $categories): Response
    {
        return Inertia::render('categories/index', [
            'categories' => $categories->list(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('categories/create');
    }

    public function store(StoreCategoryRequest $request, CategoryService $categories): RedirectResponse
    {
        $category = $categories->create($request->validated());

        return to_route('categories.show', $category);
    }

    public function show(Category $category): Response
    {
        return Inertia::render('categories/show', [
            'category' => $category,
        ]);
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category, CategoryService $categories): RedirectResponse
    {
        $category = $categories->update($category, $request->validated());

        return to_route('categories.show', $category);
    }

    public function destroy(Category $category, CategoryService $categories): RedirectResponse
    {
        $categories->delete($category);

        return to_route('categories.index');
    }
}
