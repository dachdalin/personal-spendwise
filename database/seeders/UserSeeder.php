<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // seeder for users table

            \App\Models\User::factory()->create([
                'name' => 'Dalin',
                'email' => 'dachdalin@gmail.com',
                'password' => bcrypt('12345678'),
            ]);
    }
}
