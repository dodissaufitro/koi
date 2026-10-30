<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Izinkan otorisasi di sini; pemeriksaan kepemilikan toko yang sudah ada ditangani di Controller dengan pesan ramah.
        return true;
    }

    public function rules(): array
    {
        return [
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_phone' => ['required', 'string', 'max:30'],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_phone' => ['required', 'string', 'max:30'],
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:30'],
            'logo' => ['nullable'],
            'ktp' => ['nullable'],
            'ktp_image' => ['nullable'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'owner_name.required' => 'Nama owner wajib diisi.',
            'owner_phone.required' => 'Nomor telepon owner wajib diisi.',
            'admin_name.required' => 'Nama admin wajib diisi.',
            'admin_phone.required' => 'Nomor telepon admin wajib diisi.',
            'name.required' => 'Nama dealer / farm wajib diisi.',
            'address.required' => 'Alamat dealer wajib diisi.',
            'city.required' => 'Kota wajib diisi.',
            'province.required' => 'Provinsi wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'password.min' => 'Password minimal 6 karakter jika diisi.',
        ];
    }
}
