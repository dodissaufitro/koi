<?php

namespace Tests\Feature\Auth;

use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_seller_store_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Owner Koi Farm',
            'email' => 'owner@koifarm.test',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'seller',
            'store_name' => 'Yamada Koi Farm Blitar',
            'city' => 'Blitar',
            'phone' => '08123456789',
            'address' => 'Jl. Koi Sentra No. 1',
        ]);

        $this->assertAuthenticated();

        $user = User::where('email', 'owner@koifarm.test')->first();
        $this->assertNotNull($user);
        $this->assertEquals('seller', $user->role);

        $store = Store::where('user_id', $user->id)->first();
        $this->assertNotNull($store);
        $this->assertEquals('Yamada Koi Farm Blitar', $store->name);

        $response->assertRedirect(route('seller.dashboard', absolute: false));
    }

    public function test_seller_login_redirects_to_seller_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'seller',
            'password' => bcrypt('password'),
        ]);

        Store::create([
            'user_id' => $user->id,
            'name' => 'Toko Mitra Koi',
            'slug' => 'toko-mitra-koi',
            'city' => 'Jakarta',
            'phone' => '0812345678',
            'address' => 'Jl. Muara No. 5',
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('seller.dashboard', absolute: false));
    }
}
