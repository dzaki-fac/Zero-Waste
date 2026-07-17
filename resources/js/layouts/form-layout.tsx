import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';

export default function FormLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell variant="header">
            <AppContent variant="header">
                {children}
            </AppContent>
        </AppShell>
    );
}
