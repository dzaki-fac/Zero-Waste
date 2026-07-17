const appName = import.meta.env.VITE_APP_NAME || 'Universitas Diponegoro ZeroLib';

export default function AppLogo() {
    return (
        <>
            <img
                src="/images/undip-logo.png"
                alt="Logo Universitas Diponegoro"
                className="h-12 w-12 shrink-0 object-contain"
            />
            <img
                src="/images/logo UPT.png"
                alt="Logo UPT Perpustakaan dan UNDIP Press"
                className="h-20 w-20 shrink-0 object-contain ml-2"
            />
            <img
                src="/images/LOGO ZeroLib.png"
                alt="ZeroLib — UPT Perpustakaan dan UNDIP Press"
                className="h-20 w-20 shrink-0 object-contain ml-2"
            />
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="whitespace-normal break-words leading-tight font-semibold tracking-tight">
                    {appName}
                </span>
            </div>
        </>
    );
}