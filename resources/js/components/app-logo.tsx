export default function AppLogo() {
    return (
        <>
            <div className="flex h-[90px] w-[120px] shrink-0 items-center justify-center bg-transparent group-data-[collapsible=icon]:h-14 group-data-[collapsible=icon]:w-full">
                <img
                    src="/logo-zerolib.png"
                    alt="ZeroLib"
                    className="block h-auto max-h-full w-full object-contain group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:max-h-10"
                    loading="eager"
                    draggable={false}
                />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="m-0 font-semibold leading-[1.12] tracking-tight text-gray-950">
                    <span className="block text-[18px]">Universitas</span>
                    <span className="block text-[18px]">Diponegoro</span>
                    <span className="mt-1 block text-[21px]">ZeroLib</span>
                </p>
            </div>
        </>
    );
}
