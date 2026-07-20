<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dokumen/index', [
            'documents' => Document::all()->keyBy('type'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:peraturan,struktur,sop'],
            'title' => ['required', 'string', 'max:255'],
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'is_published' => ['boolean'],
        ]);

        $existing = Document::where('type', $validated['type'])->first();
        if ($existing) {
            $oldPath = str_replace('/storage/', '', $existing->pdf_url);
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $existing->delete();
        }

        $validated['pdf_url'] = Storage::url($request->file('pdf')->store('documents', 'public'));

        Document::create($validated);

        return to_route('admin.dokumen.index');
    }

    public function update(Request $request, Document $document): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'is_published' => ['boolean'],
        ]);

        if ($request->hasFile('pdf')) {
            $oldPath = str_replace('/storage/', '', $document->pdf_url);
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $validated['pdf_url'] = Storage::url($request->file('pdf')->store('documents', 'public'));
        }

        unset($validated['pdf']);

        $document->update($validated);

        return to_route('admin.dokumen.index');
    }

    public function destroy(Document $document): RedirectResponse
    {
        $oldPath = str_replace('/storage/', '', $document->pdf_url);
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $document->delete();

        return to_route('admin.dokumen.index');
    }

    public function show(string $type): JsonResponse
    {
        $document = Document::ofType($type)->published()->first();

        return response()->json(['document' => $document]);
    }

    public function peraturanPage(): Response
    {
        $document = Document::ofType('peraturan')->published()->first();

        return Inertia::render('peraturan', [
            'document' => $document,
        ]);
    }

    public function strukturPage(): Response
    {
        $document = Document::ofType('struktur')->published()->first();

        return Inertia::render('struktur', [
            'document' => $document,
        ]);
    }

    public function sopPage(): Response
    {
        $document = Document::ofType('sop')->published()->first();

        return Inertia::render('SOPPage', [
            'document' => $document,
        ]);
    }
}
