<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlaceBidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $auction = $this->route('auction');
        $minBid = $auction ? ((float) $auction->current_bid + 500000) : 500000;

        return [
            'amount' => [
                'required',
                'numeric',
                'min:' . $minBid,
                function ($attribute, $value, $fail) use ($auction) {
                    if ($auction) {
                        $diff = (float) $value - (float) $auction->current_bid;
                        if ($diff < 500000 || fmod($diff, 500000) != 0) {
                            $fail('Kelipatan Bid (KB) resmi yang ditentukan platform adalah kelipatan Rp 500.000 atau Rp 1.000.000.');
                        }
                    }
                },
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $auction = $this->route('auction');
            $user = $this->user();
            if (! $user && $this->filled('user_id')) {
                $user = \App\Models\User::find($this->input('user_id'));
            }

            if ($auction && $user && (int) $auction->highest_bidder_id === (int) $user->id) {
                $validator->errors()->add(
                    'amount',
                    'Anda saat ini masih memegang penawaran tertinggi. Anda tidak dapat menawar lagi kecuali penawaran Anda sudah ditimpa oleh orang lain.'
                );
            }
        });
    }

    public function messages(): array
    {
        $auction = $this->route('auction');
        $current = $auction ? number_format($auction->current_bid, 0, ',', '.') : 0;

        return [
            'amount.min' => "Tawaran Anda harus lebih tinggi minimal Rp 500.000 dari penawaran saat ini (Rp {$current}).",
        ];
    }
}
