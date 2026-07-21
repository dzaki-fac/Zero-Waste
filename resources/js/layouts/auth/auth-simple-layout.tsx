import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-green-50 to-white p-6 md:p-10">
            <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center">
            <img
                src="/logo_zerolib.jpeg"
                alt="ZeroLib Logo"
                className="w-48 sm:w-56 md:w-64 object-contain -mb-15 max-w-[80vw]"
            />

            <h1 className="text-xl font-medium text-center">
                {title}
            </h1>

            <p className="mt-1 text-center text-sm text-muted-foreground">
                {description}
            </p>
        </div>
                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
