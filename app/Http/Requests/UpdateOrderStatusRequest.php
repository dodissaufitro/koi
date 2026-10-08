<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');
        if (! $order) {
            return false;
        }

        return $this->user() !== null && (
            $this->user()->isAdmin() ||
            ($this->user()->store && $this->user()->store->id === $order->store_id)
        );
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,paid,processing,shipped,delivered,completed,cancelled'],
            'shipping_tracking_number' => ['nullable', 'string', 'max:100'],
            'cancellation_reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}
