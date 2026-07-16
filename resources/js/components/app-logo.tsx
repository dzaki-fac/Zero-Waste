const appName = import.meta.env.VITE_APP_NAME || 'Universitas Diponegoro ZeroLib';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm overflow-hidden">
                <img src="/logo-upt.png" alt="Universitas Diponegoro ZeroLib" className="size-full object-cover" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="whitespace-normal break-words leading-tight font-semibold tracking-tight">
                    {appName}
                </span>
            </div>
        </>
    );
}
