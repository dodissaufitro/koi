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
        $minBid = $auction ? ((float) $auction->current_bid + 1) : 0;

        return [
            'amount' => ['required', 'numeric', 'min:' . $minBid],
        ];
    }

    public function messages(): array
    {
        $auction = $this->route('auction');
        $minBid = $auction ? number_format($auction->current_bid, 0, ',', '.') : 0;

        return [
            'amount.min' => "Tawaran Anda harus lebih tinggi dari penawaran saat ini (Rp {$minBid}).",
        ];
    }
}
