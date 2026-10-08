<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && ($this->user()->isSeller() || $this->user()->isAdmin());
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'in:kg,gram,ekor,box,pack'],
            'weight_gram' => ['required', 'integer', 'min:1'],
            'condition' => ['required', 'in:fresh,live,frozen,processed'],
            'catch_type' => ['nullable', 'in:laut,tambak,tawar'],
            'origin' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:active,inactive,draft'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }
}
