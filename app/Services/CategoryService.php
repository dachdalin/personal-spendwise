<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CategoryService
{
    /**
     * @return LengthAwarePaginator<int, Category>
     */
    public function list(): LengthAwarePaginator
    {
        return Category::query()
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * @param  array{name: string, slug?: string|null, icon?: string|null, color?: string|null}  $data
     */
    public function create(array $data): Category
    {
        return Category::create($this->normalizedData($data));
    }

    /**
     * @param  array{name: string, slug?: string|null, icon?: string|null, color?: string|null}  $data
     */
    public function update(Category $category, array $data): Category
    {
        $category->update($this->normalizedData($data));

        return $category->refresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }

    /**
     * @param  array{name: string, slug?: string|null, icon?: string|null, color?: string|null}  $data
     * @return array{name: string, slug: string, icon?: string|null, color?: string|null}
     */
    private function normalizedData(array $data): array
    {
        $data['slug'] = filled($data['slug'] ?? null)
            ? Str::slug($data['slug'])
            : Str::slug($data['name']);

        return $data;
    }
}
