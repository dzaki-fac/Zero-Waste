<?php

namespace App\Http\Controllers;

use App\Models\Poster;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'is_published' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        $validated['image_url'] = Storage::url($request->file('image')->store('images', 'public'));

        Poster::create($validated);

        return to_route('admin.poster.index');
    }

    public function update(Request $request, Poster $poster): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'tag' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'is_published' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        if ($request->hasFile('image')) {
            $oldPath = str_replace('/storage/', '', $poster->image_url);
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $validated['image_url'] = Storage::url($request->file('image')->store('images', 'public'));
        }

        unset($validated['image']);

        $poster->update($validated);

        return to_route('admin.poster.index');
    }

    public function destroy(Poster $poster): RedirectResponse
    {
        $poster->delete();

        return to_route('admin.poster.index');
    }
}
