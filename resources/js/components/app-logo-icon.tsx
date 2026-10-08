import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="12" fill="#DC2626" />
            {/* Koi Circle & Fish Silhouette */}
            <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <path
                d="M20 9C15 9 12 14 12 18C12 24 17 28 20 33C23 28 28 24 28 18C28 14 25 9 20 9Z"
                fill="white"
            />
            {/* Maruten Red Spot (Kohaku Characteristic) */}
            <circle cx="20" cy="16" r="3.2" fill="#DC2626" />
            <path
                d="M15 21C11.5 20.5 9 23 10 25.5C12 27 15 24.5 15 21Z"
                fill="white"
                opacity="0.9"
            />
            <path
                d="M25 21C28.5 20.5 31 23 30 25.5C28 27 25 24.5 25 21Z"
                fill="white"
                opacity="0.9"
            />
        </svg>
    );
}
