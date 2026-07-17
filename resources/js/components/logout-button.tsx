import { router } from '@inertiajs/react';
import { logout as logoutRoute } from '@/routes';

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export default function LogoutButton({ className = '', children = 'Logout' }: Props) {
    const handleLogout = () => {
        router.post(logoutRoute().url, {}, {
            preserveScroll: false,
        });
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className={className}
        >
            {children}
        </button>
    );
}
