export default function AppLogo() {
    return (
        <>
            <img
                src="/images/undip-logo.png"
                alt="Logo Universitas Diponegoro"
                className="size-8 shrink-0 object-contain"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">
                    Universitas Diponegoro
                </span>
                <span className="truncate leading-tight text-xs text-muted-foreground">
                    UPT Perpustakaan dan Undip Press
                </span>
            </div>
        </>
    );
}
