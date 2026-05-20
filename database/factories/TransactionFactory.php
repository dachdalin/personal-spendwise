<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category = Category::factory();

        return [
            'title' => fake()->words(3, true),
            'category_id' => $category,
            'budget_id' => Budget::factory(['category_id' => $category]),
            'user_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 10, 1000),
            'description' => fake()->optional()->sentence(),
            'type' => fake()->randomElement(['expense', 'income']),
            'date' => fake()->date(),
        ];
    }
}
