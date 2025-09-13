import * as React from 'react';
import services from './services.json';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'บริการออนไลน์',
}

const iconMap: Record<string, React.JSX.Element> = {
    stethoscope: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3v6a6 6 0 0012 0V3m-6 12v3m0 0a3 3 0 006 0v-3" /></svg>
    ),
    ambulance: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v-4a1 1 0 011-1h3V7a1 1 0 011-1h8a1 1 0 011 1v5h3a1 1 0 011 1v4M5 21a2 2 0 100-4 2 2 0 000 4zm14 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
    ),
    xray: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} /><path d="M7 7h10M7 12h10M7 17h10" strokeWidth={2} /></svg>
    ),
    flask: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2v6a6 6 0 0012 0V2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 10v10a2 2 0 002 2h8a2 2 0 002-2V10" /></svg>
    ),
    capsules: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><rect x="7" y="7" width="10" height="10" rx="5" strokeWidth={2} /><path d="M7 7l10 10" strokeWidth={2} /></svg>
    ),
    scalpel: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M7 17h6a2 2 0 002-2v-6" /></svg>
    ),
    baby: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><circle cx="12" cy="12" r="10" strokeWidth={2} /><circle cx="9" cy="10" r="1" /><circle cx="15" cy="10" r="1" /><path d="M9 16c1.5-1 4.5-1 6 0" strokeWidth={2} /></svg>
    ),
    female: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto"><circle cx="12" cy="8" r="5" strokeWidth={2} /><path d="M12 13v7M9 20h6" strokeWidth={2} /></svg>
    ),
};

const cardColors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-yellow-600',
    'bg-red-600',
    'bg-teal-600',
    'bg-indigo-600',
];


function isSvgString(str: string) {
    return str.trim().startsWith('<svg');
}

function ServicesPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">บริการออนไลน์</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {services.map((service, idx) => (
                    <a
                        key={service.name}
                        href={service.link}
                        className={`rounded-xl shadow-lg flex flex-col items-center justify-center p-6 aspect-square ${service.color} text-white transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50`}
                        tabIndex={0}
                        aria-label={service.name}
                    >
                        <div className="mb-4">
                            {typeof service.icon === 'string' && isSvgString(service.icon) ? (
                                <span
                                    className="mx-auto block"
                                    style={{ width: 48, height: 48 }}
                                    dangerouslySetInnerHTML={{ __html: service.icon.replace('width=\"24\"', 'width=\"48\"').replace('height=\"24\"', 'height=\"48\"') }}
                                />
                            ) : iconMap[service.icon] ? (
                                React.cloneElement(iconMap[service.icon], { width: 48, height: 48, className: 'mx-auto' })
                            ) : (
                                <span className="text-3xl">?</span>
                            )}
                        </div>
                        <div className="text-lg font-semibold text-center mb-2">{service.name}</div>
                        {service.description && (
                            <div className="text-sm text-center opacity-80">{service.description}</div>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default ServicesPage;