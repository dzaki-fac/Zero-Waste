function getRuntimeBase(): string {
    if (typeof window !== 'undefined' && window.__assetBase !== undefined && window.__assetBase !== '') {
        return window.__assetBase;
    }
    return import.meta.env.BASE_URL || '/';
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
