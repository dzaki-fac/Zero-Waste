<?php

namespace App\Http\Controllers;

use App\Helpers\OptionHelper;
use App\Http\Requests\DataDasarRequest;
use App\Models\DataDasar;
use App\Models\Distribusi;
use App\Models\Penimbangan;
use App\Models\PilahSampah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DataDasarController extends Controller
{
    private function computeBaseline(): array
    {
        $perDay = Penimbangan::select(
            DB::raw('DATE(tanggal) as tanggal'),
            DB::raw('SUM(berat_sampah) as total')
        )
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->get();

        $avg = $perDay->isNotEmpty()
            ? round($perDay->avg('total'), 2)
            : 0;

        return [
            'baseline_sampah' => $avg,
            'baseline_sampah_periode' => 'hari',
        ];
    }

    private function computeTotalSampahTerkelola(): float
    {
        return round(Penimbangan::sum('berat_sampah'), 2);
    }

    private function computeSampahResidu(): float
    {
        $avgPilah = PilahSampah::select(
            DB::raw('DATE(tanggal) as tanggal'),
            DB::raw('SUM(berat) as total')
        )
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->get()
            ->avg('total');

        $avgDistribusi = Distribusi::select(
            DB::raw('DATE(tanggal) as tanggal'),
            DB::raw('SUM(berat) as total')
        )
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->get()
            ->avg('total');

        return round(($avgPilah ?? 0) - ($avgDistribusi ?? 0), 2);
    }

    private function computeJenisSampahDominan(): array
    {
        $data = PilahSampah::select(
            'jenis_sampah',
            DB::raw('SUM(berat) as total_berat'),
            DB::raw('COUNT(DISTINCT DATE(tanggal)) as total_hari')
        )
            ->groupBy('jenis_sampah')
            ->get();

        return $data->map(fn ($item) => [
            'kategori' => $item->jenis_sampah,
            'berat' => round($item->total_berat / max($item->total_hari, 1), 2),
            'periode' => 'hari',
        ])->toArray();
    }

    public function index(): Response
    {
        $dataDasar = DataDasar::where('user_id', auth()->id())->first();

        return Inertia::render('data-dasar/index', [
            'dataDasar' => $dataDasar,
            'rincianArea' => OptionHelper::get('rincian_area', []),
            'computedBaseline' => $this->computeBaseline(),
            'computedJenisSampah' => $this->computeJenisSampahDominan(),
            'computedSampahResidu' => $this->computeSampahResidu(),
            'computedTotalSampahTerkelola' => $this->computeTotalSampahTerkelola(),
        ]);
    }

    public function update(DataDasarRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();

        $validated['total_warga'] = (int) $validated['jumlah_mahasiswa']
            + (int) $validated['jumlah_dosen']
            + (int) $validated['jumlah_tendik']
            + (int) $validated['jumlah_tenaga_pendukung'];

        $validated = array_merge($validated, $this->computeBaseline());
        $validated['sampah_residu_akhir'] = $this->computeSampahResidu();
        $validated['total_sampah_terkelola'] = $this->computeTotalSampahTerkelola();
        $validated['jenis_sampah_dominan'] = $this->computeJenisSampahDominan();

        if ($request->has('rincian_area')) {
            $rincian = $request->input('rincian_area');
            $validated['luas_area_fakultas'] = array_sum(array_map(fn ($a) => (float) ($a['luas'] ?? 0), $rincian));
            OptionHelper::save(['rincian_area' => $rincian]);
        }

        DataDasar::updateOrCreate(
            ['user_id' => auth()->id()],
            $validated
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data dasar berhasil disimpan.',
        ]);

        return redirect()->back();
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $dataDasar = DataDasar::where('user_id', auth()->id())->first();
        $rincianArea = OptionHelper::get('rincian_area', []);

        $headers = [
            'No', 'Data', 'Nilai', 'Satuan',
        ];

        $rows = [];

        if ($dataDasar) {
            $rows[] = ['', 'Nama Tim', $dataDasar->nama_tim, ''];
            $rows[] = ['', 'Fakultas', $dataDasar->fakultas, ''];
            $rows[] = ['', 'Alamat', $dataDasar->alamat ?? '-', ''];
            $rows[] = ['', 'Penanggung Jawab', $dataDasar->penanggung_jawab, ''];
            $rows[] = ['', 'Nomor HP/Email', $dataDasar->nomor_hp_email, ''];
            $rows[] = ['', 'Tanggal Pengisian', $dataDasar->tanggal_pengisian, ''];
            $rows[] = ['', 'Jumlah Mahasiswa', number_format($dataDasar->jumlah_mahasiswa, 0, ',', '.'), 'orang'];
            $rows[] = ['', 'Jumlah Dosen', number_format($dataDasar->jumlah_dosen, 0, ',', '.'), 'orang'];
            $rows[] = ['', 'Jumlah Tenaga Kependidikan', number_format($dataDasar->jumlah_tendik, 0, ',', '.'), 'orang'];
            $rows[] = ['', 'Jumlah Tenaga Pendukung', number_format($dataDasar->jumlah_tenaga_pendukung, 0, ',', '.'), 'orang'];
            $rows[] = ['', 'Total Warga', number_format($dataDasar->total_warga, 0, ',', '.'), 'orang'];

            foreach ($rincianArea as $area) {
                $rows[] = ['', 'Luas Area - ' . $area['nama'], number_format((float) ($area['luas'] ?? 0), 0, ',', '.'), 'm²'];
            }

            $totalLuas = array_sum(array_map(fn ($a) => (float) ($a['luas'] ?? 0), $rincianArea));
            $rows[] = ['', 'Total Luas Area', number_format($totalLuas, 0, ',', '.'), 'm²'];

            $baseline = $this->computeBaseline();
            $rows[] = ['', 'Baseline Sampah Awal', number_format($baseline['baseline_sampah'], 2, ',', '.'), 'kg/' . $baseline['baseline_sampah_periode']];

            $jenisDominan = $this->computeJenisSampahDominan();
            $jenisStr = implode('; ', array_map(fn ($j) => $j['kategori'] . ': ' . number_format((float) $j['berat'], 2, ',', '.') . ' kg/' . $j['periode'], $jenisDominan));
            $rows[] = ['', 'Jenis Sampah Dominan', $jenisStr, ''];
            $rows[] = ['', 'Sampah Residu Akhir', number_format($this->computeSampahResidu(), 2, ',', '.'), 'kg/hari'];
            $rows[] = ['', 'Total Sampah Terkelola', number_format($this->computeTotalSampahTerkelola(), 2, ',', '.'), 'kg'];
            $rows[] = ['', 'Kondisi Fasilitas', $dataDasar->kondisi_fasilitas ?? '-', ''];

            $rows[] = ['', '', '', ''];
            $rows[] = ['', '--- PENILAIAN ---', '', ''];

            $baselineVal = $baseline['baseline_sampah'];
            $residuVal = $this->computeSampahResidu();
            $totalSampah = $this->computeTotalSampahTerkelola();
            $totalWarga = (int) $dataDasar->total_warga;
            $wargaTerlibat = (int) $dataDasar->jumlah_warga_terlibat_aktif;
            $luasFakultas = (float) $dataDasar->luas_area_fakultas;
            $luasZW = (float) $dataDasar->luas_area_zero_waste;

            $pengurangan = $baselineVal > 0 ? round(($baselineVal - $residuVal) / $baselineVal * 100, 2) : null;
            $perKapita = $totalWarga > 0 ? round($totalSampah / $totalWarga, 2) : null;
            $partisipasi = $totalWarga > 0 ? round($wargaTerlibat / $totalWarga * 100, 2) : null;
            $cakupan = $luasFakultas > 0 ? round($luasZW / $luasFakultas * 100, 2) : null;

            $rows[] = ['', 'Persentase Pengurangan Sampah', $pengurangan !== null ? number_format($pengurangan, 2, ',', '.') . '%' : '-', ''];
            $rows[] = ['', 'Sampah Terkelola per Kapita', $perKapita !== null ? number_format($perKapita, 2, ',', '.') . ' kg/orang' : '-', ''];
            $rows[] = ['', 'Persentase Partisipasi', $partisipasi !== null ? number_format($partisipasi, 2, ',', '.') . '%' : '-', ''];
            $rows[] = ['', 'Cakupan Area Terkelola', $cakupan !== null ? number_format($cakupan, 2, ',', '.') . '%' : '-', ''];
        }

        $callback = function () use ($headers, $rows) {
            $stream = fopen('php://output', 'w');
            fprintf($stream, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($stream, $headers);
            foreach ($rows as $row) {
                fputcsv($stream, $row);
            }

            fclose($stream);
        };

        return response()->streamDownload($callback, 'data_dasar_' . now()->format('Y-m-d') . '.csv');
    }
}
