import { Ziggy } from '@/ziggy';

function getRuntimeBase(): string {
    if (import.meta.env.DEV) {
        return import.meta.env.BASE_URL || '/';
    }
    const url = Ziggy.url.replace(/\/+$/, '');
    return url ? url + '/' : '/';
}

export function baseUrl(path: string): string {
    const base = getRuntimeBase();
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return normalizedBase + normalizedPath;
}

export function asset(path: string): string {
    return baseUrl(path);
}

export function apiUrl(path: string): string {
    return baseUrl(path);
}
