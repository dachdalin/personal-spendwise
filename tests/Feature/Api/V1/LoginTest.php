<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_receive_sanctum_token(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson(route('api.v1.auth.login'), [
            'email' => $user->email,
            'password' => 'password',
            'device_name' => 'iPhone',
        ]);

        $response
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->whereType('token', 'string')
                ->where('token_type', 'Bearer')
                ->where('user.id', $user->id)
                ->where('user.name', $user->name)
                ->where('user.email', $user->email)
                ->missing('user.password')
            );

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
            'name' => 'iPhone',
        ]);
    }

    public function test_user_can_access_authenticated_route_with_issued_token(): void
    {
        $user = User::factory()->create();

        $token = $this->postJson(route('api.v1.auth.login'), [
            'email' => $user->email,
            'password' => 'password',
        ])->json('token');

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('id', $user->id);
    }

    public function test_user_can_logout_and_revoke_current_token(): void
    {
        $user = User::factory()->create();

        $token = $this->postJson(route('api.v1.auth.login'), [
            'email' => $user->email,
            'password' => 'password',
            'device_name' => 'Android',
        ])->json('token');

        $this->withToken($token)
            ->postJson(route('api.v1.auth.logout'))
            ->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertNull(PersonalAccessToken::findToken($token));
    }

    public function test_logout_requires_authentication(): void
    {
        $this->postJson(route('api.v1.auth.logout'))
            ->assertUnauthorized();
    }

    public function test_user_can_not_login_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->postJson(route('api.v1.auth.login'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_email_and_password_are_required(): void
    {
        $this->postJson(route('api.v1.auth.login'))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
