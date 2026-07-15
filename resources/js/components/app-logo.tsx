import AppLogoIcon from '@/components/app-logo-icon';

const appName = import.meta.env.VITE_APP_NAME || 'Zero Waste';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold tracking-tight">
                    {appName}
                </span>
            </div>
        </>
    );
}
