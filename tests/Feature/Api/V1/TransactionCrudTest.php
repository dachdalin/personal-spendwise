<?php

namespace Tests\Feature\Api\V1;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransactionCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_not_access_transactions(): void
    {
        $this->getJson(route('api.v1.transactions.index'))
            ->assertUnauthorized();
    }

    public function test_authenticated_users_can_list_transactions(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Transaction::factory()->count(2)->create();

        $this->getJson(route('api.v1.transactions.index'))
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->has('data', 2)
                ->has('data.0.category')
                ->has('data.0.budget')
                ->has('data.0.user')
                ->has('links')
                ->has('meta')
            );
    }

    public function test_authenticated_users_can_create_transactions(): void
    {
        $user = User::factory()->create();
        $submittedUser = User::factory()->create();

        Sanctum::actingAs($user);

        $category = Category::factory()->create([
            'name' => 'Food',
            'slug' => 'food',
        ]);
        $budget = Budget::factory()->create(['category_id' => $category->id]);

        $this->postJson(route('api.v1.transactions.store'), [
            'title' => 'Grocery shopping',
            'category_id' => $category->id,
            'budget_id' => $budget->id,
            'user_id' => $submittedUser->id,
            'amount' => '35.50',
            'description' => 'Weekly groceries',
            'type' => 'expense',
            'date' => '2026-05-20',
        ])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Grocery shopping')
            ->assertJsonPath('data.category_id', $category->id)
            ->assertJsonPath('data.budget_id', $budget->id)
            ->assertJsonPath('data.user_id', $user->id)
            ->assertJsonPath('data.amount', '35.50')
            ->assertJsonPath('data.description', 'Weekly groceries')
            ->assertJsonPath('data.type', 'expense')
            ->assertJsonPath('data.date', '2026-05-20')
            ->assertJsonPath('data.category.name', 'Food')
            ->assertJsonPath('data.user.id', $user->id);

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

    public function test_authenticated_users_can_view_a_transaction(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create([
            'name' => 'Bills',
            'slug' => 'bills',
        ]);
        $budget = Budget::factory()->create(['category_id' => $category->id]);
        $transaction = Transaction::factory()->create([
            'title' => 'Internet',
            'category_id' => $category->id,
            'budget_id' => $budget->id,
            'amount' => '60.25',
            'type' => 'expense',
            'date' => '2026-06-01',
        ]);

        $this->getJson(route('api.v1.transactions.show', $transaction))
            ->assertOk()
            ->assertJsonPath('data.id', $transaction->id)
            ->assertJsonPath('data.title', 'Internet')
            ->assertJsonPath('data.amount', '60.25')
            ->assertJsonPath('data.type', 'expense')
            ->assertJsonPath('data.date', '2026-06-01')
            ->assertJsonPath('data.category.name', 'Bills')
            ->assertJsonPath('data.budget.id', $budget->id);
    }

    public function test_authenticated_users_can_update_transactions(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $transaction = Transaction::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create([
            'name' => 'Salary',
            'slug' => 'salary',
        ]);
        $budget = Budget::factory()->create(['category_id' => $category->id]);

        $this->patchJson(route('api.v1.transactions.update', $transaction), [
            'title' => 'Salary',
            'category_id' => $category->id,
            'budget_id' => $budget->id,
            'amount' => '2500.00',
            'description' => '',
            'type' => 'income',
            'date' => '2026-06-01',
        ])
            ->assertOk()
            ->assertJsonPath('data.id', $transaction->id)
            ->assertJsonPath('data.title', 'Salary')
            ->assertJsonPath('data.category_id', $category->id)
            ->assertJsonPath('data.budget_id', $budget->id)
            ->assertJsonPath('data.user_id', $user->id)
            ->assertJsonPath('data.amount', '2500.00')
            ->assertJsonPath('data.description', null)
            ->assertJsonPath('data.type', 'income')
            ->assertJsonPath('data.date', '2026-06-01');

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

    public function test_transaction_requires_existing_budget(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create();

        $this->postJson(route('api.v1.transactions.store'), [
            'title' => 'Grocery shopping',
            'category_id' => $category->id,
            'budget_id' => 999,
            'amount' => '35.50',
            'type' => 'expense',
            'date' => '2026-05-20',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('budget_id');
    }

    public function test_transaction_type_must_be_valid(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $category = Category::factory()->create();
        $budget = Budget::factory()->create(['category_id' => $category->id]);

        $this->postJson(route('api.v1.transactions.store'), [
            'title' => 'Grocery shopping',
            'category_id' => $category->id,
            'budget_id' => $budget->id,
            'amount' => '35.50',
            'type' => 'transfer',
            'date' => '2026-05-20',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('type');
    }

    public function test_authenticated_users_can_delete_transactions(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $transaction = Transaction::factory()->create();

        $this->deleteJson(route('api.v1.transactions.destroy', $transaction))
            ->assertNoContent();

        $this->assertDatabaseMissing('transactions', [
            'id' => $transaction->id,
        ]);
    }
}
