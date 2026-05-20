<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('categories.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_categories(): void
    {
        $user = User::factory()->create();
        Category::factory()->create(['name' => 'Food', 'slug' => 'food']);

        $this->actingAs($user)
            ->get(route('categories.index'))
            ->assertOk();
    }

    public function test_authenticated_users_can_create_categories(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('categories.store'), [
                'name' => 'Emergency Fund',
                'slug' => '',
                'icon' => 'wallet',
                'color' => '#0f766e',
            ])
            ->assertRedirect(route('categories.show', Category::first()));

        $this->assertDatabaseHas('categories', [
            'name' => 'Emergency Fund',
            'slug' => 'emergency-fund',
            'icon' => 'wallet',
            'color' => '#0f766e',
        ]);
    }

    public function test_slug_must_be_unique(): void
    {
        $user = User::factory()->create();
        Category::factory()->create(['slug' => 'food']);

        $this->actingAs($user)
            ->post(route('categories.store'), [
                'name' => 'Food',
                'slug' => 'food',
            ])
            ->assertSessionHasErrors('slug');
    }

    public function test_authenticated_users_can_update_categories(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['slug' => 'old-name']);

        $this->actingAs($user)
            ->patch(route('categories.update', $category), [
                'name' => 'New Name',
                'slug' => 'new category name',
                'icon' => 'briefcase',
                'color' => '#1d4ed8',
            ])
            ->assertRedirect(route('categories.show', $category));

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name',
            'slug' => 'new-category-name',
            'icon' => 'briefcase',
            'color' => '#1d4ed8',
        ]);
    }

    public function test_authenticated_users_can_delete_categories(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user)
            ->delete(route('categories.destroy', $category))
            ->assertRedirect(route('categories.index'));

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}
