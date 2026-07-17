<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataDasarRequest;
use App\Models\DataDasar;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DataDasarController extends Controller
{
    public function index(): Response
    {
        $dataDasar = DataDasar::where('user_id', auth()->id())->first();

        return Inertia::render('data-dasar/index', [
            'dataDasar' => $dataDasar,
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
}
