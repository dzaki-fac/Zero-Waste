import type { SVGAttributes } from 'react';
import { asset } from '@/lib/path';

export default function UptLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src={asset('/images/logo UPT.png')}
            alt="Logo UPT Perpustakaan dan UNDIP Press"
            className="h-32 w-32 object-contain"
        />
    );
}
