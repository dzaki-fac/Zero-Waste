import type { SVGAttributes } from 'react';
import { asset } from '@/lib/path';

export default function UndipLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src={asset('/images/undip-logo.png')}
            alt="Logo Universitas Diponegoro"
            className="h-12 w-12 object-contain"
        />
    );
}