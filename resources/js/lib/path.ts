import { Ziggy } from '@/ziggy';

function getRuntimeBase(): string {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
        return import.meta.env.BASE_URL || '/';
    }
    const baseUrl = Ziggy.url.replace(/\/+$/, '');
    return baseUrl ? baseUrl + '/' : '/';
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
