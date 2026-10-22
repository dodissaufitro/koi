<?php

namespace Tests\Feature;

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_ping_requires_token(): void
    {
        $response = $this->getJson('/api/v1/ping');
        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'error_code' => 'MISSING_API_TOKEN',
            ]);
    }

    public function test_api_ping_rejects_invalid_token(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer invalid_token_123')
            ->getJson('/api/v1/ping');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'error_code' => 'INVALID_OR_EXPIRED_TOKEN',
            ]);
    }

    public function test_api_ping_accepts_valid_token(): void
    {
        $token = ApiToken::create([
            'name' => 'Test iOS Client',
            'token' => 'koki_ios_test_sample_token_for_verification_unit_testing',
            'device_type' => 'ios',
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token->token)
            ->getJson('/api/v1/ping');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $token->refresh();
        $this->assertNotNull($token->last_used_at);
    }

    public function test_api_get_products_with_token(): void
    {
        $token = ApiToken::firstOrCreate(
            ['token' => 'koki_ios_test_token'],
            ['name' => 'iOS App', 'device_type' => 'ios', 'is_active' => true]
        );

        $response = $this->withHeader('Authorization', 'Bearer ' . $token->token)
            ->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'meta',
            ]);
    }
}
