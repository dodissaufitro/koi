<?php

namespace App\Console\Commands;

use App\Models\Auction;
use Illuminate\Console\Command;

class CloseEndedAuctions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auctions:close-ended';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menutup otomatis sesi lelang yang tanggal dan waktunya telah selesai serta menetapkan pemenang lelang';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $closedCount = Auction::closeEndedAuctions();

        if ($closedCount > 0) {
            $this->info("Berhasil menutup {$closedCount} sesi lelang yang telah mencapai batas waktu.");
        } else {
            $this->line("Tidak ada sesi lelang yang perlu ditutup saat ini.");
        }

        return Command::SUCCESS;
    }
}
