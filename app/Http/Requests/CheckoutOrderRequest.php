<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['required', 'string', 'max:20'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'shipping_courier' => ['required', 'string', 'max:100'],
            'payment_method' => ['required', 'in:transfer_bank,qris,cod,ewallet'],
            'buyer_notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
