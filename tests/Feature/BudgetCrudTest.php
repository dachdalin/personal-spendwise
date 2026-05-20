<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BudgetCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('budgets.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_budgets(): void
    {
        $user = User::factory()->create();
        Budget::factory()->create();

        $this->actingAs($user)
            ->get(route('budgets.index'))
            ->assertOk();
    }

    public function test_authenticated_users_can_create_budgets(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user)
            ->post(route('budgets.store'), [
                'category_id' => $category->id,
                'amount' => '1250.50',
                'date' => '2026-05-20',
            ])
            ->assertRedirect(route('budgets.show', Budget::first()));

        $this->assertDatabaseHas('budgets', [
            'category_id' => $category->id,
            'amount' => 1250.5,
            'date' => '2026-05-20 00:00:00',
        ]);
    }

    public function test_budget_requires_existing_category(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('budgets.store'), [
                'category_id' => 999,
                'amount' => '1250.50',
                'date' => '2026-05-20',
            ])
            ->assertSessionHasErrors('category_id');
    }

    public function test_budget_amount_must_be_positive(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user)
            ->post(route('budgets.store'), [
                'category_id' => $category->id,
                'amount' => '0',
                'date' => '2026-05-20',
            ])
            ->assertSessionHasErrors('amount');
    }

    public function test_authenticated_users_can_update_budgets(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user)
            ->patch(route('budgets.update', $budget), [
                'category_id' => $category->id,
                'amount' => '2500.75',
                'date' => '2026-06-01',
            ])
            ->assertRedirect(route('budgets.show', $budget));

        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'category_id' => $category->id,
            'amount' => 2500.75,
            'date' => '2026-06-01 00:00:00',
        ]);
    }

    public function test_authenticated_users_can_delete_budgets(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create();

        $this->actingAs($user)
            ->delete(route('budgets.destroy', $budget))
            ->assertRedirect(route('budgets.index'));

        $this->assertDatabaseMissing('budgets', [
            'id' => $budget->id,
        ]);
    }
}
