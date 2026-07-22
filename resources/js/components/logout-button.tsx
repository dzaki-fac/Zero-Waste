import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export default function LogoutButton({ className = '', children = 'Logout' }: Props) {
    const handleLogout = () => {
        router.post(route('logout'), {}, {
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
