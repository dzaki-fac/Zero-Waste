import type { SVGAttributes } from 'react';

export default function UndipLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src="/images/undip-logo.png"
            alt="Logo Universitas Diponegoro"
            className="h-12 w-12 object-contain"
        />
    );
}