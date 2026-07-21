import type { AuthLayoutProps } from '@/types';
import { baseUrl } from '@/lib/path';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-green-50 to-white p-6 md:p-10">
            <div className="w-full max-w-sm">
            <div className="flex w-full flex-col items-center text-center">
                <img
                    src={baseUrl('/images/zerolib-logo.png')}
                    alt="ZeroLib Logo"
                    className="h-auto w-full max-w-[280px] object-contain sm:max-w-[320px]"
                />

                <div className="mt-5">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>
                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
