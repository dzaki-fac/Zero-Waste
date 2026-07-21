import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    open: boolean;
    processing: boolean;
    error: string;
    onOpenChange: (open: boolean) => void;
    onSubmit: (note: string) => void;
};

export default function DistributionRevisionDialog({
    open,
    processing,
    error,
    onOpenChange,
    onSubmit,
}: Props) {
    const [note, setNote] = useState('');

    useEffect(() => {
        if (open) {
            setNote('');
        }
    }, [open]);

    const handleSubmit = () => {
        const trimmed = note.trim();

        if (!trimmed || processing) {
return;
}

        onSubmit(trimmed);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Catatan Perbaikan</DialogTitle>
                    <DialogDescription>
                        Jelaskan data apa saja yang perlu diperbaiki oleh petugas.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="revision-note">Catatan untuk Petugas</Label>
                    <Textarea
                        id="revision-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Contoh: Perbaiki berat sampah, lokasi distribusi, dan tujuan distribusi."
                        className="min-h-[100px]"
                        disabled={processing}
                    />
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                        disabled={processing}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing || note.trim().length === 0}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Catatan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
