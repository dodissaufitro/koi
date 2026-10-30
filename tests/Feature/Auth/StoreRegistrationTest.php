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
        $user = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($user)->post('/stores/register', [
            'owner_name' => 'Budi Santoso',
            'owner_phone' => '08123456789',
            'admin_name' => 'Rina Admin',
            'admin_phone' => '08987654321',
            'name' => 'Yamada Koi Farm Blitar',
            'city' => 'Blitar',
            'province' => 'Jawa Timur',
            'address' => 'Jl. Koi Sentra No. 1',
        ]);

        $this->assertDatabaseHas('stores', [
            'user_id' => $user->id,
            'name' => 'Yamada Koi Farm Blitar',
            'owner_name' => 'Budi Santoso',
            'admin_name' => 'Rina Admin',
            'province' => 'Jawa Timur',
            'is_verified' => false,
        ]);
    }

    public function test_guest_can_register_as_seller_with_new_account(): void
    {
        $response = $this->post('/stores/register', [
            'owner_name' => 'Agus Farm',
            'owner_phone' => '085512345678',
            'admin_name' => 'Admin Agus',
            'admin_phone' => '085587654321',
            'name' => 'Agus Koi Center',
            'city' => 'Kediri',
            'province' => 'Jawa Timur',
            'address' => 'Jl. Brantas No. 8',
            'email' => 'agus@aguskoi.test',
            'password' => 'secret123',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'agus@aguskoi.test',
            'role' => 'seller',
        ]);

        $this->assertDatabaseHas('stores', [
            'name' => 'Agus Koi Center',
            'owner_name' => 'Agus Farm',
            'admin_name' => 'Admin Agus',
            'province' => 'Jawa Timur',
            'is_verified' => false,
        ]);
    }

    public function test_unverified_seller_cannot_login(): void
    {
        $user = User::factory()->create([
            'role' => 'seller',
            'password' => bcrypt('password'),
        ]);

        Store::create([
            'user_id' => $user->id,
            'name' => 'Toko Belum Verif',
            'slug' => 'toko-belum-verif',
            'city' => 'Surabaya',
            'phone' => '0812345678',
            'address' => 'Jl. Ikan No. 1',
            'is_verified' => false,
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
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
            'is_verified' => true,
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('seller.dashboard', absolute: false));
    }

    public function test_seller_registration_with_base64_image_does_not_fail(): void
    {
        // 1x1 transparent PNG / JPEG base64 string or large base64 data URL
        $base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $response = $this->post('/stores/register', [
            'owner_name' => 'Dodi Owner',
            'owner_phone' => '08231232',
            'admin_name' => 'Samsul Admin',
            'admin_phone' => '0823231',
            'name' => 'Dodi Koi Farm',
            'city' => 'Blitar',
            'province' => 'Jawa Timur',
            'address' => 'Jl. Mawar No. 12',
            'email' => 'dodi@dodikoifarm.test',
            'password' => 'password123',
            'logo' => $base64Image,
            'ktp' => $base64Image,
        ]);

        $this->assertDatabaseHas('stores', [
            'name' => 'Dodi Koi Farm',
            'owner_name' => 'Dodi Owner',
            'admin_name' => 'Samsul Admin',
            'is_verified' => false,
        ]);

        $store = Store::where('name', 'Dodi Koi Farm')->first();
        $this->assertNotNull($store);
        $this->assertNotNull($store->logo);
        $this->assertStringStartsWith('/storage/stores/logos/', $store->logo);
        $this->assertNotNull($store->ktp_image);
        $this->assertStringStartsWith('/storage/stores/ktp/', $store->ktp_image);
    }

    public function test_guest_can_register_store_without_explicit_email_and_password(): void
    {
        $response = $this->post('/stores/register', [
            'owner_name' => 'Pak Joko',
            'owner_phone' => '081298765432',
            'admin_name' => 'Admin Joko',
            'admin_phone' => '081298765433',
            'name' => 'Joko Nishikigoi Center',
            'city' => 'Tulungagung',
            'province' => 'Jawa Timur',
            'address' => 'Jl. Pahlawan No. 45',
        ]);

        $this->assertDatabaseHas('stores', [
            'name' => 'Joko Nishikigoi Center',
            'owner_name' => 'Pak Joko',
            'is_verified' => false,
        ]);

        $user = User::where('email', 'seller_081298765432@koimart.local')->first();
        $this->assertNotNull($user);
        $this->assertEquals('seller', $user->role);
    }

    public function test_guest_can_register_store_using_existing_buyer_email(): void
    {
        $buyer = User::factory()->create([
            'role' => 'buyer',
            'email' => 'buyer_upgrade@example.com',
        ]);

        $response = $this->post('/stores/register', [
            'owner_name' => 'Mitra Baru',
            'owner_phone' => '087711223344',
            'admin_name' => 'Admin Mitra',
            'admin_phone' => '087711223355',
            'name' => 'Mitra Baru Koi',
            'city' => 'Malang',
            'province' => 'Jawa Timur',
            'address' => 'Jl. Ijen No. 10',
            'email' => 'buyer_upgrade@example.com',
        ]);

        $this->assertDatabaseHas('stores', [
            'user_id' => $buyer->id,
            'name' => 'Mitra Baru Koi',
            'is_verified' => false,
        ]);

        $buyer->refresh();
        $this->assertEquals('seller', $buyer->role);
    }
}
