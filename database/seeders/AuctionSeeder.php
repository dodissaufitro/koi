<?php

namespace Database\Seeders;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class AuctionSeeder extends Seeder
{
    public function run(): void
    {
        $buyer1 = User::where('email', 'budi@pasasikan.test')->first();
        $buyer2 = User::where('email', 'siti@pasasikan.test')->first();

        $showa = Product::where('slug', 'showa-sanshoku-isa-bloodline-55cm')->first();
        $sanke = Product::where('slug', 'taisho-sanke-sakai-fish-farm-42cm')->first();
        $kohaku = Product::where('slug', 'kohaku-maruten-dainichi-bloodline-48cm')->first();
        $tancho = Product::where('slug', 'tancho-kohaku-perfect-circle-38cm')->first();
        $shiro = Product::where('slug', 'shiro-utsuri-omosako-contrast-44cm')->first();

        $now = now();
        $endDate = now()->addDays(2)->addHours(4);

        $auctionsData = [
            [
                'product' => $showa,
                'start_price' => 15000000,
                'bid_increment' => 500000,
                'current_bid' => 26500000, // LELANG TERTINGGI #1
                'buyout_price' => 35000000,
                'highest_bidder_id' => $buyer1?->id,
                'bids_count' => 24,
                'favorites_count' => 182,
                'end_time' => $endDate,
            ],
            [
                'product' => $sanke,
                'start_price' => 10000000,
                'bid_increment' => 500000,
                'current_bid' => 21000000, // LELANG TERTINGGI #2
                'buyout_price' => 30000000,
                'highest_bidder_id' => $buyer2?->id,
                'bids_count' => 19,
                'favorites_count' => 312, // LELANG TERFAVORIT #1 (Paling banyak disukai)
                'end_time' => now()->addHours(18),
            ],
            [
                'product' => $kohaku,
                'start_price' => 12000000,
                'bid_increment' => 500000,
                'current_bid' => 18500000,
                'buyout_price' => 25000000,
                'highest_bidder_id' => $buyer1?->id,
                'bids_count' => 15,
                'favorites_count' => 248, // LELANG TERFAVORIT #2
                'end_time' => now()->addDays(1)->addHours(8),
            ],
            [
                'product' => $shiro,
                'start_price' => 9000000,
                'bid_increment' => 300000,
                'current_bid' => 17800000,
                'buyout_price' => 24000000,
                'highest_bidder_id' => $buyer2?->id,
                'bids_count' => 16,
                'favorites_count' => 205, // LELANG TERFAVORIT #3
                'end_time' => now()->addDays(2),
            ],
            [
                'product' => $tancho,
                'start_price' => 8000000,
                'bid_increment' => 200000,
                'current_bid' => 15200000,
                'buyout_price' => 20000000,
                'highest_bidder_id' => $buyer1?->id,
                'bids_count' => 12,
                'favorites_count' => 175,
                'end_time' => now()->addHours(9),
            ],
        ];

        foreach ($auctionsData as $data) {
            if (! $data['product']) {
                continue;
            }

            $auction = Auction::updateOrCreate(
                ['product_id' => $data['product']->id],
                [
                    'start_price' => $data['start_price'],
                    'bid_increment' => $data['bid_increment'],
                    'current_bid' => $data['current_bid'],
                    'buyout_price' => $data['buyout_price'],
                    'highest_bidder_id' => $data['highest_bidder_id'],
                    'bids_count' => $data['bids_count'],
                    'favorites_count' => $data['favorites_count'],
                    'start_time' => $now,
                    'end_time' => $data['end_time'],
                    'status' => 'active',
                ]
            );

            // Buat sample riwayat bid
            if ($buyer1 && $buyer2) {
                Bid::firstOrCreate(
                    [
                        'auction_id' => $auction->id,
                        'amount' => $auction->current_bid,
                    ],
                    [
                        'user_id' => $auction->highest_bidder_id,
                    ]
                );
            }
        }
    }
}
