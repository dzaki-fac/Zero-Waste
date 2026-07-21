import type { SVGAttributes } from 'react';
import { baseUrl } from '@/lib/path';

export default function ZeroLibLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src={baseUrl('/images/zerolib-logo.png')}
            alt="ZeroLib — UPT Perpustakaan dan UNDIP Press"
            className="h-18 w-20 object-contain align-middle"
        />
    );
}