<?php

namespace Tests\Feature\Api\V1;

use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BudgetCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_not_access_budgets(): void
    {
        $this->getJson(route('api.v1.budgets.index'))
            ->assertUnauthorized();
    }

    public function test_authenticated_users_can_list_budgets(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Budget::factory()->count(2)->create();

        $this->getJson(route('api.v1.budgets.index'))
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->has('data', 2)
                ->has('data.0.category')
                ->has('links')
                ->has('meta')
            );
    }

    public function test_authenticated_users_can_create_budgets(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create([
            'name' => 'Food',
            'slug' => 'food',
        ]);

        $this->postJson(route('api.v1.budgets.store'), [
            'category_id' => $category->id,
            'amount' => '1250.50',
            'date' => '2026-05-20',
        ])
            ->assertCreated()
            ->assertJsonPath('data.category_id', $category->id)
            ->assertJsonPath('data.amount', '1250.50')
            ->assertJsonPath('data.date', '2026-05-20')
            ->assertJsonPath('data.category.id', $category->id)
            ->assertJsonPath('data.category.name', 'Food');

        $this->assertDatabaseHas('budgets', [
            'category_id' => $category->id,
            'amount' => 1250.5,
            'date' => '2026-05-20 00:00:00',
        ]);
    }

    public function test_authenticated_users_can_view_a_budget(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create([
            'name' => 'Bills',
            'slug' => 'bills',
        ]);
        $budget = Budget::factory()->create([
            'category_id' => $category->id,
            'amount' => '900.25',
            'date' => '2026-06-01',
        ]);

        $this->getJson(route('api.v1.budgets.show', $budget))
            ->assertOk()
            ->assertJsonPath('data.id', $budget->id)
            ->assertJsonPath('data.category_id', $category->id)
            ->assertJsonPath('data.amount', '900.25')
            ->assertJsonPath('data.date', '2026-06-01')
            ->assertJsonPath('data.category.name', 'Bills');
    }

    public function test_authenticated_users_can_update_budgets(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $budget = Budget::factory()->create();
        $category = Category::factory()->create([
            'name' => 'Travel',
            'slug' => 'travel',
        ]);

        $this->patchJson(route('api.v1.budgets.update', $budget), [
            'category_id' => $category->id,
            'amount' => '2500.75',
            'date' => '2026-06-01',
        ])
            ->assertOk()
            ->assertJsonPath('data.id', $budget->id)
            ->assertJsonPath('data.category_id', $category->id)
            ->assertJsonPath('data.amount', '2500.75')
            ->assertJsonPath('data.date', '2026-06-01')
            ->assertJsonPath('data.category.name', 'Travel');

        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'category_id' => $category->id,
            'amount' => 2500.75,
            'date' => '2026-06-01 00:00:00',
        ]);
    }

    public function test_budget_requires_existing_category(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson(route('api.v1.budgets.store'), [
            'category_id' => 999,
            'amount' => '1250.50',
            'date' => '2026-05-20',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category_id');
    }

    public function test_budget_amount_must_be_positive(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create();

        $this->postJson(route('api.v1.budgets.store'), [
            'category_id' => $category->id,
            'amount' => '0',
            'date' => '2026-05-20',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('amount');
    }

    public function test_authenticated_users_can_delete_budgets(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $budget = Budget::factory()->create();

        $this->deleteJson(route('api.v1.budgets.destroy', $budget))
            ->assertNoContent();

        $this->assertDatabaseMissing('budgets', [
            'id' => $budget->id,
        ]);
    }
}
