<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('transactions.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_transactions(): void
    {
        $user = User::factory()->create();
        Transaction::factory()->create();

        $this->actingAs($user)
            ->get(route('transactions.index'))
            ->assertOk();
    }

    public function test_authenticated_users_can_create_transactions(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $budget = Budget::factory()->create(['category_id' => $category->id]);

        $this->actingAs($user)
            ->post(route('transactions.store'), [
                'title' => 'Grocery shopping',
                'category_id' => $category->id,
                'budget_id' => $budget->id,
                'amount' => '35.50',
                'description' => 'Weekly groceries',
                'type' => 'expense',
                'date' => '2026-05-20',
                'user_id' => User::factory()->create()->id,
            ])
            ->assertRedirect(route('transactions.show', Transaction::first()));

        $this->assertDatabaseHas('transactions', [
            'title' => 'Grocery shopping',
            'category_id' => $category->id,
            'budget_id' => $budget->id,
            'user_id' => $user->id,
            'amount' => 35.5,
            'description' => 'Weekly groceries',
            'type' => 'expense',
            'date' => '2026-05-20 00:00:00',
        ]);
    }

    public function test_transaction_requires_existing_budget(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user)
            ->post(route('transactions.store'), [
                'title' => 'Grocery shopping',
                'category_id' => $category->id,
                'budget_id' => 999,
                'amount' => '35.50',
                'type' => 'expense',
                'date' => '2026-05-20',
            ])
            ->assertSessionHasErrors('budget_id');
    }

    public function test_transaction_type_must_be_valid(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $budget = Budget::factory()->create(['category_id' => $category->id]);

        $this->actingAs($user)
            ->post(route('transactions.store'), [
                'title' => 'Grocery shopping',
                'category_id' => $category->id,
                'budget_id' => $budget->id,
                'amount' => '35.50',
                'type' => 'transfer',
                'date' => '2026-05-20',
            ])
            ->assertSessionHasErrors('type');
    }

    public function test_authenticated_users_can_update_transactions(): void
    {
        $user = User::factory()->create();
        $transaction = Transaction::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create();
        $budget = Budget::factory()->create(['category_id' => $category->id]);

        $this->actingAs($user)
            ->patch(route('transactions.update', $transaction), [
                'title' => 'Salary',
                'category_id' => $category->id,
                'budget_id' => $budget->id,
                'amount' => '2500.00',
                'description' => '',
                'type' => 'income',
                'date' => '2026-06-01',
            ])
            ->assertRedirect(route('transactions.show', $transaction));

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'title' => 'Salary',
            'category_id' => $category->id,
            'budget_id' => $budget->id,
            'user_id' => $user->id,
            'amount' => 2500,
            'description' => null,
            'type' => 'income',
            'date' => '2026-06-01 00:00:00',
        ]);
    }

    public function test_authenticated_users_can_delete_transactions(): void
    {
        $user = User::factory()->create();
        $transaction = Transaction::factory()->create();

        $this->actingAs($user)
            ->delete(route('transactions.destroy', $transaction))
            ->assertRedirect(route('transactions.index'));

        $this->assertDatabaseMissing('transactions', [
            'id' => $transaction->id,
        ]);
    }
}
