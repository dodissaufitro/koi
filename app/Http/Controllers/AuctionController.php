<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceBidRequest;
use App\Models\Auction;
use App\Models\AuctionFavorite;
use App\Models\Bid;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AuctionController extends Controller
{
    /**
     * Menampilkan daftar lelang koi dengan tab Lelang Tertinggi & Lelang Favorit.
     */
    public function index(Request $request): InertiaResponse|JsonResponse
    {
        $tab = $request->query('tab', 'highest'); // 'highest' atau 'favorite'

        $query = Auction::query()
            ->with(['product.primaryImage', 'product.store', 'highestBidder'])
            ->active();

        if ($tab === 'favorite') {
            $query->mostFavorited();
        } else {
            $query->highestBid();
        }

        $auctions = $query->paginate(9)->withQueryString();

        // Ambil data ringkasan untuk quick preview
        $highestBidAuctions = Auction::active()
            ->with(['product.primaryImage', 'product.store', 'highestBidder'])
            ->highestBid()
            ->limit(4)
            ->get();

        $favoriteAuctions = Auction::active()
            ->with(['product.primaryImage', 'product.store', 'highestBidder'])
            ->mostFavorited()
            ->limit(4)
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'auctions' => $auctions,
                'highest_bid_auctions' => $highestBidAuctions,
                'favorite_auctions' => $favoriteAuctions,
                'current_tab' => $tab,
            ]);
        }

        return Inertia::render('Auctions/Index', [
            'auctions' => $auctions,
            'highestBidAuctions' => $highestBidAuctions,
            'favoriteAuctions' => $favoriteAuctions,
            'currentTab' => $tab,
        ]);
    }

    /**
     * Detail lelang ikan koi dan riwayat penawaran (bidding history).
     */
    public function show(Request $request, Auction $auction): InertiaResponse|JsonResponse
    {
        $auction->load([
            'product.images',
            'product.store.user',
            'highestBidder',
            'bids.user',
        ]);

        $isFavorited = false;
        if ($request->user()) {
            $isFavorited = AuctionFavorite::where('auction_id', $auction->id)
                ->where('user_id', $request->user()->id)
                ->exists();
        }

        if ($request->wantsJson()) {
            return response()->json([
                'auction' => $auction,
                'is_favorited' => $isFavorited,
            ]);
        }

        return Inertia::render('Auctions/Show', [
            'auction' => $auction,
            'isFavorited' => $isFavorited,
        ]);
    }

    /**
     * Memasang penawaran bid pada lelang koi.
     */
    public function placeBid(PlaceBidRequest $request, Auction $auction): RedirectResponse|JsonResponse
    {
        if ($auction->is_ended) {
            if ($auction->status === 'active') {
                // Jika lelang berstatus aktif namun timer lewat, perpanjang otomatis
                $auction->update(['end_time' => now()->addDays(7)]);
            } else {
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'Lelang untuk ikan koi ini telah berakhir.'], 422);
                }
                return back()->withErrors(['amount' => 'Lelang untuk ikan koi ini telah berakhir.']);
            }
        }

        $user = $request->user();
        if (! $user && $request->filled('user_id')) {
            $user = \App\Models\User::find($request->input('user_id'));
        }
        if (! $user) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Silakan masuk / login terlebih dahulu untuk memasang tawaran.'], 401);
            }
            return back()->withErrors(['amount' => 'Silakan masuk / login terlebih dahulu untuk memasang tawaran.']);
        }
        $amount = (float) $request->input('amount');

        try {
            DB::transaction(function () use ($auction, $user, $amount) {
                // Lock record auction untuk mencegah race condition penawaran bersamaan
                $lockedAuction = Auction::lockForUpdate()->find($auction->id);

                if ((int) $lockedAuction->highest_bidder_id === (int) $user->id) {
                    throw new \Exception('Anda saat ini masih memegang penawaran tertinggi. Anda tidak dapat menawar lagi kecuali penawaran Anda sudah ditimpa oleh orang lain.');
                }

                if ($amount <= $lockedAuction->current_bid) {
                    throw new \Exception('Tawaran Anda harus lebih tinggi dari penawaran tertinggi saat ini.');
                }

                $diff = $amount - (float) $lockedAuction->current_bid;
                if ($diff < 500000 || fmod($diff, 500000) != 0) {
                    throw new \Exception('Kelipatan Bid (KB) resmi yang ditentukan platform adalah kelipatan Rp 500.000 atau Rp 1.000.000.');
                }

                // Simpan riwayat penawaran langsung ke tabel bids di database
                Bid::create([
                    'auction_id' => $lockedAuction->id,
                    'user_id' => $user->id,
                    'amount' => $amount,
                ]);

                // Update data lelang di tabel auctions di database
                $lockedAuction->update([
                    'current_bid' => $amount,
                    'highest_bidder_id' => $user->id,
                    'bids_count' => $lockedAuction->bids_count + 1,
                ]);
            });
        } catch (\Throwable $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }
            return back()->withErrors(['amount' => $e->getMessage()]);
        }

        if ($request->wantsJson()) {
            $fresh = $auction->fresh(['highestBidder', 'bids.user']);
            return response()->json([
                'success' => true,
                'message' => 'Penawaran bid Anda berhasil masuk dan tersimpan ke database!',
                'current_bid' => (float) $fresh->current_bid,
                'highest_bidder' => $fresh->highestBidder?->name ?? $user->name,
                'highest_bidder_id' => $fresh->highest_bidder_id,
                'bids_count' => $fresh->bids_count,
                'history' => $fresh->bids()->with('user')->latest()->get()->map(function ($b) {
                    return [
                        'user' => $b->user?->name ?? 'Kolektor',
                        'amount' => (float) $b->amount,
                        'time' => $b->created_at ? $b->created_at->diffForHumans() : 'Baru saja',
                    ];
                }),
                'auction' => $fresh,
            ]);
        }

        return back()->with('success', 'Selamat! Anda sekarang memimpin penawaran lelang tertinggi.');
    }

    /**
     * Menandai atau membatalkan lelang favorit (toggle favorite).
     */
    public function toggleFavorite(Request $request, Auction $auction): RedirectResponse|JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            abort(401);
        }

        $existing = AuctionFavorite::where('auction_id', $auction->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $auction->decrement('favorites_count');
            $favorited = false;
        } else {
            AuctionFavorite::create([
                'auction_id' => $auction->id,
                'user_id' => $user->id,
            ]);
            $auction->increment('favorites_count');
            $favorited = true;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'favorited' => $favorited,
                'favorites_count' => $auction->fresh()->favorites_count,
            ]);
        }

        return back();
    }

    /**
     * Mengambil daftar lelang yang pernah ditawar oleh pengguna beserta statusnya (Memimpin, Terlampaui, Menang).
     */
    public function myBids(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user && $request->filled('user_id')) {
            $user = \App\Models\User::find($request->input('user_id'));
        }
        if (! $user) {
            return response()->json(['bids' => []], 401);
        }

        $bids = Bid::where('user_id', $user->id)
            ->with(['auction.product.primaryImage', 'auction.product.store', 'auction.highestBidder'])
            ->latest()
            ->get();

        $auctionGroups = $bids->groupBy('auction_id');

        $result = [];
        foreach ($auctionGroups as $auctionId => $userAuctionBids) {
            $auc = $userAuctionBids->first()->auction;
            if (! $auc) {
                continue;
            }

            $myHighestBid = (float) $userAuctionBids->max('amount');
            $currentBid = (float) $auc->current_bid;
            $isLeading = ((int) $auc->highest_bidder_id === (int) $user->id);
            $isEnded = $auc->is_ended;

            $status = 'outbid';
            if ($isEnded) {
                $status = $isLeading ? 'won' : 'lost';
            } else {
                $status = $isLeading ? 'leading' : 'outbid';
            }

            $prod = $auc->product;
            $sizeMatch = '75 cm';
            if ($prod && preg_match('/\b(\d+\s*cm)\b/i', $prod->name, $matches)) {
                $sizeMatch = $matches[1];
            }

            $img = $prod?->primaryImage?->image_path ?? '/images/koi/kohaku.jpg';

            $result[] = [
                'id' => $auc->id,
                'auctionId' => $auc->id,
                'name' => $prod?->name ?? 'Ikan Lelang Koi',
                'size' => $sizeMatch,
                'variety' => $prod?->category?->name ?? 'Kohaku',
                'store' => $prod?->store?->name ?? 'Mitra Koi Farm',
                'image' => $img,
                'currentBid' => $currentBid,
                'myBid' => $myHighestBid,
                'highestBidder' => $auc->highestBidder?->name ?? 'Kolektor',
                'isLeading' => $isLeading,
                'status' => $status,
                'isEnded' => $isEnded,
                'bidsCount' => $auc->bids_count,
                'timeLeft' => $isEnded ? 'Lelang Selesai' : 'Berakhir besok, 20:00 WIB',
                'updatedAt' => $userAuctionBids->first()->created_at ? $userAuctionBids->first()->created_at->diffForHumans() : 'Baru saja',
                'auctionRaw' => $auc,
            ];
        }

        return response()->json([
            'bids' => $result,
        ]);
    }
}
