<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoryCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_not_access_categories(): void
    {
        $this->getJson(route('api.v1.categories.index'))
            ->assertUnauthorized();
    }

    public function test_authenticated_users_can_list_categories(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Category::factory()->create(['name' => 'Food', 'slug' => 'food']);
        Category::factory()->create(['name' => 'Travel', 'slug' => 'travel']);

        $this->getJson(route('api.v1.categories.index'))
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->has('data', 2)
                ->has('links')
                ->has('meta')
            );
    }

    public function test_authenticated_users_can_create_categories(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson(route('api.v1.categories.store'), [
            'name' => 'Emergency Fund',
            'slug' => '',
            'icon' => 'wallet',
            'color' => '#0f766e',
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Emergency Fund')
            ->assertJsonPath('data.slug', 'emergency-fund')
            ->assertJsonPath('data.icon', 'wallet')
            ->assertJsonPath('data.color', '#0f766e');

        $this->assertDatabaseHas('categories', [
            'name' => 'Emergency Fund',
            'slug' => 'emergency-fund',
            'icon' => 'wallet',
            'color' => '#0f766e',
        ]);
    }

    public function test_authenticated_users_can_view_a_category(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create([
            'name' => 'Bills',
            'slug' => 'bills',
        ]);

        $this->getJson(route('api.v1.categories.show', $category))
            ->assertOk()
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'Bills')
            ->assertJsonPath('data.slug', 'bills');
    }

    public function test_authenticated_users_can_update_categories(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create(['slug' => 'old-name']);

        $this->patchJson(route('api.v1.categories.update', $category), [
            'name' => 'New Name',
            'slug' => 'new category name',
            'icon' => 'briefcase',
            'color' => '#1d4ed8',
        ])
            ->assertOk()
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'New Name')
            ->assertJsonPath('data.slug', 'new-category-name')
            ->assertJsonPath('data.icon', 'briefcase')
            ->assertJsonPath('data.color', '#1d4ed8');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name',
            'slug' => 'new-category-name',
        ]);
    }

    public function test_slug_must_be_unique_when_creating_categories(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Category::factory()->create(['slug' => 'food']);

        $this->postJson(route('api.v1.categories.store'), [
            'name' => 'Food',
            'slug' => 'food',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('slug');
    }

    public function test_slug_must_be_unique_when_updating_categories(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Category::factory()->create(['slug' => 'food']);
        $category = Category::factory()->create(['slug' => 'travel']);

        $this->patchJson(route('api.v1.categories.update', $category), [
            'name' => 'Travel',
            'slug' => 'food',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('slug');
    }

    public function test_authenticated_users_can_delete_categories(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create();

        $this->deleteJson(route('api.v1.categories.destroy', $category))
            ->assertNoContent();

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}
