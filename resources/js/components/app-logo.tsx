export default function AppLogo() {
    return (
        <div
            className="
                flex w-full items-center gap-2 overflow-visible
                group-data-[collapsible=icon]:justify-center
                group-data-[collapsible=icon]:gap-0
            "
        >
            {/* Logo */}
            <div
                className="
                    flex h-[100px] w-[140px] shrink-0
                    items-center justify-center
                    overflow-visible bg-transparent
                    group-data-[collapsible=icon]:h-16
                    group-data-[collapsible=icon]:w-full
                "
            >
                <img
                    src="/logo-zerolib.png"
                    alt="ZeroLib"
                    className="
                        block h-auto w-[140px] max-w-none
                        scale-[1.12] object-contain
                        group-data-[collapsible=icon]:max-h-12
                        group-data-[collapsible=icon]:w-16
                        group-data-[collapsible=icon]:scale-110
                    "
                    loading="eager"
                    draggable={false}
                />
            </div>

            {/* Institution name */}
            <div
                className="
                    min-w-0 flex-1
                    group-data-[collapsible=icon]:hidden
                "
            >
                <p className="m-0 leading-[1.08] tracking-[-0.02em] text-gray-950">
                    <span className="block font-serif text-[20px] font-semibold">
                        Universitas
                    </span>

                    <span className="block font-serif text-[20px] font-semibold">
                        Diponegoro
                    </span>

                    <span className="mt-1 block font-serif text-[24px] font-bold">
                        <span className="italic">Zero</span>
                        <span className="not-italic">Lib</span>
                    </span>
                </p>
            </div>
        </div>
    );
}