'use client';

export default function Spinner({ className = 'w-5 h-5' }) {
    return (
        <svg className={`animate-spin text-gray-600 ${className}`} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"></path>
        </svg>
    );
}
