import type { SVGAttributes } from 'react';
import { asset } from '@/lib/path';

export default function ZeroLibLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src={asset('/images/zerolib-logo.png')}
            alt="ZeroLib — UPT Perpustakaan dan UNDIP Press"
            className="h-18 w-20 object-contain align-middle"
        />
    );
}