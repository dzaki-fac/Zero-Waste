export function baseUrl(path: string): string {
    const basePath = import.meta.env.VITE_BASE_PATH || '';
    return basePath + path;
}
