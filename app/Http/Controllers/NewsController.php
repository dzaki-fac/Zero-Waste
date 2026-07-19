<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('berita/index', [
            'news' => News::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tag' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'date' => ['required', 'string', 'max:255'],
            'image_url' => ['required', 'url', 'max:2048'],
            'href' => ['required', 'url', 'max:2048'],
            'is_published' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        News::create($validated);

        return to_route('admin.berita.index');
    }

    public function update(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'tag' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'date' => ['required', 'string', 'max:255'],
            'image_url' => ['required', 'url', 'max:2048'],
            'href' => ['required', 'url', 'max:2048'],
            'is_published' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        $news->update($validated);

        return to_route('admin.berita.index');
    }

    public function destroy(News $news): RedirectResponse
    {
        $news->delete();

        return to_route('admin.berita.index');
    }
}
