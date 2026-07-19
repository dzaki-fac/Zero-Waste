<?php

namespace App\Http\Controllers;

use App\Models\Poster;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PosterController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('poster/index', [
            'posters' => Poster::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'tag' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'image_url' => ['required', 'url', 'max:2048'],
            'is_published' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        Poster::create($validated);

        return to_route('admin.poster.index');
    }

    public function update(Request $request, Poster $poster): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'tag' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'image_url' => ['required', 'url', 'max:2048'],
            'is_published' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        $poster->update($validated);

        return to_route('admin.poster.index');
    }

    public function destroy(Poster $poster): RedirectResponse
    {
        $poster->delete();

        return to_route('admin.poster.index');
    }
}
