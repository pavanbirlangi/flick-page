import React from 'react';

interface DashboardPanelProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function DashboardPanel({ title, description, children }: DashboardPanelProps) {
    return (
        <div className="bg-black rounded-2xl shadow-2xl shadow-black/50">
            <div className="p-6 sm:p-8 border-b border-neutral-700">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-gray-400 mt-1">{description}</p>
            </div>
            <div className="p-6 sm:p-8">
                {children}
            </div>
        </div>
    )
}