<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Verifikasi KoiMart</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 24px;
            color: #1e293b;
        }
        .container {
            max-width: 520px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #0f172a;
        }
        .text {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }
        .otp-box {
            background: #f0f9ff;
            border: 2px dashed #0284c7;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            margin: 24px 0;
        }
        .otp-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #0369a1;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #0284c7;
            font-family: 'Courier New', Courier, monospace;
        }
        .notice {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            color: #92400e;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>KoiMart</h1>
            <p>Pasar Ikan Koi & Lelang Terpercaya</p>
        </div>
        <div class="content">
            <div class="greeting">Halo, {{ $name }}! 👋</div>
            <div class="text">
                Terima kasih telah mendaftar di <strong>KoiMart</strong> menggunakan akun Google. Untuk menyelesaikan pendaftaran dan mengamankan akun Anda, silakan gunakan kode OTP (One-Time Password) berikut:
            </div>

            <div class="otp-box">
                <div class="otp-label">Kode Verifikasi Anda</div>
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <div class="notice">
                ⚠️ <strong>PENTING:</strong> Kode ini hanya berlaku selama <strong>10 menit</strong>. Jangan pernah membagikan kode OTP ini kepada siapa pun, termasuk pihak yang mengatasnamakan tim KoiMart.
            </div>

            <div class="text" style="font-size: 12px; color: #64748b;">
                Jika Anda tidak merasa melakukan pendaftaran di KoiMart, Anda dapat mengabaikan email ini dengan aman.
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} KoiMart Indonesia. Seluruh hak cipta dilindungi.
        </div>
    </div>
</body>
</html>
