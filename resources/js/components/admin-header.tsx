import { usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';

export default function AdminHeader({
    onMenuClick,
}: {
    onMenuClick: () => void;
}) {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-emerald-200 bg-white px-4 md:px-6 lg:px-8">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-emerald-600"
                onClick={onMenuClick}
                aria-label="Toggle sidebar"
            >
                <Menu className="size-5" />
            </Button>

            <div className="hidden md:block" />

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-medium text-emerald-900">
                        {auth.user?.name}
                    </p>
                    <p className="text-xs font-medium text-emerald-600">
                        {auth.user?.role === 'admin' ? 'Admin' : 'Petugas'}
                    </p>
                </div>
                <Avatar className="size-9">
                    <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">
                        {auth.user ? getInitials(auth.user.name) : '?'}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
