<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_superadmin_login_redirects_to_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@pasasikan.test',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@pasasikan.test',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($admin);
        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_regular_user_cannot_access_admin_dashboard(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($buyer)->get('/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_superadmin_can_view_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertStatus(200);
    }

    public function test_superadmin_can_create_and_delete_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/categories', [
            'name' => 'Shusui Koi Special',
            'description' => 'Varietas koi bersisik doitsu',
            'icon' => 'sparkles',
            'is_active' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', ['name' => 'Shusui Koi Special']);

        $category = Category::where('name', 'Shusui Koi Special')->first();

        $deleteResponse = $this->actingAs($admin)->delete("/admin/categories/{$category->id}");
        $deleteResponse->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_superadmin_can_update_user_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $targetUser = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($admin)->put("/admin/users/{$targetUser->id}", [
            'name' => 'Updated User Name',
            'email' => $targetUser->email,
            'role' => 'seller',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'role' => 'seller',
            'name' => 'Updated User Name',
        ]);
    }

    public function test_superadmin_can_directly_verify_partner_store(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $buyer = User::factory()->create(['role' => 'buyer']);
        $store = Store::create([
            'user_id' => $buyer->id,
            'name' => 'Mitra Baru Koi Malang',
            'slug' => 'mitra-baru-koi-malang',
            'description' => 'Peternak koi pemula',
            'address' => 'Malang Jawa Timur',
            'city' => 'Malang',
            'phone' => '081234567890',
            'is_verified' => false,
        ]);

        $this->assertFalse($store->is_verified);

        // Superadmin memverifikasi langsung toko mitra
        $response = $this->actingAs($admin)->post("/admin/stores/{$store->id}/toggle-verify", [
            'is_verified' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('stores', [
            'id' => $store->id,
            'is_verified' => true,
        ]);

        // Owner otomatis dipromosikan jadi seller
        $this->assertDatabaseHas('users', [
            'id' => $buyer->id,
            'role' => 'seller',
        ]);

        // Toggle kembali unverify
        $response2 = $this->actingAs($admin)->post("/admin/stores/{$store->id}/toggle-verify", [
            'is_verified' => false,
        ]);

        $response2->assertSessionHasNoErrors();
        $this->assertDatabaseHas('stores', [
            'id' => $store->id,
            'is_verified' => false,
        ]);
    }

    public function test_superadmin_can_toggle_product_auction_eligible(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $seller = User::factory()->create(['role' => 'seller']);
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Blitar Koi Champion',
            'slug' => 'blitar-koi-champion',
            'description' => 'Breeder Koi Blitar',
            'address' => 'Blitar Jawa Timur',
            'city' => 'Blitar',
            'is_verified' => true,
        ]);
        $category = Category::create([
            'name' => 'Kohaku',
            'slug' => 'kohaku',
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'name' => 'Kohaku Maruten 65cm',
            'slug' => 'kohaku-maruten-65cm',
            'description' => 'Kohaku istimewa',
            'price' => 15000000,
            'stock' => 1,
            'is_active' => true,
            'is_auction_eligible' => false,
        ]);

        $response = $this->actingAs($admin)->post("/admin/products/{$product->id}/toggle-auction-eligible");
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_auction_eligible' => true,
        ]);

        // Toggle back
        $response2 = $this->actingAs($admin)->post("/admin/products/{$product->id}/toggle-auction-eligible");
        $response2->assertSessionHasNoErrors();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_auction_eligible' => false,
        ]);
    }

    public function test_superadmin_can_launch_auction_for_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $seller = User::factory()->create(['role' => 'seller']);
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Dainichi Koi Farm',
            'slug' => 'dainichi-koi-farm',
            'description' => 'Niigata Champion',
            'address' => 'Niigata Japan',
            'city' => 'Niigata',
            'is_verified' => true,
        ]);
        $category = Category::create([
            'name' => 'Showas',
            'slug' => 'showas',
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'name' => 'Showa Isa Bloodline',
            'slug' => 'showa-isa-bloodline',
            'description' => 'Showa berkualitas lelang',
            'price' => 35000000,
            'stock' => 1,
            'is_active' => true,
            'is_auction_eligible' => true,
        ]);

        $response = $this->actingAs($admin)->post("/admin/products/{$product->id}/create-auction", [
            'start_price' => 25000000,
            'bid_increment' => 1000000,
            'buyout_price' => 50000000,
            'end_time' => now()->addDays(2)->format('Y-m-d H:i:s'),
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('auctions', [
            'product_id' => $product->id,
            'start_price' => 25000000,
            'bid_increment' => 1000000,
            'buyout_price' => 50000000,
            'status' => 'active',
        ]);
    }
}
