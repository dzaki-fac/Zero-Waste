import type { SVGAttributes } from 'react';
import { baseUrl } from '@/lib/path';

export default function UndipLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src={baseUrl('/images/undip-logo.png')}
            alt="Logo Universitas Diponegoro"
            className="h-12 w-12 object-contain"
        />
    );
}