<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $product = $this->route('product');
        if (! $product) {
            return false;
        }

        return $this->user() !== null && (
            $this->user()->isAdmin() ||
            ($this->user()->store && $this->user()->store->id === $product->store_id)
        );
    }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'numeric', 'min:0'],
            'unit' => ['sometimes', 'required', 'string', 'in:kg,gram,ekor,box,pack'],
            'weight_gram' => ['sometimes', 'required', 'integer', 'min:1'],
            'condition' => ['sometimes', 'required', 'in:fresh,live,frozen,processed'],
            'catch_type' => ['nullable', 'in:laut,tambak,tawar'],
            'origin' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'in:active,inactive,draft'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }
}
