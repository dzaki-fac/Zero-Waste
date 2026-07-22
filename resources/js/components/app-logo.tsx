export default function AppLogo() {
    return (
        <div className="flex w-full items-center justify-center group-data-[collapsible=icon]:justify-center">
            <img
                src="/images/zerolib-logo.png"
                alt="ZeroLib"
                className="h-auto w-[130px] object-contain group-data-[collapsible=icon]:w-12"
                loading="eager"
                draggable={false}
            />
        </div>
    );
}
