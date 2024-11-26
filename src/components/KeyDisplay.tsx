import React from 'react';

interface KeyDisplayProps {
    activeKeys: {
        w: boolean;
        a: boolean;
        s: boolean;
        d: boolean;
        q: boolean;
        e: boolean;
        x: boolean;
    };
}

export const KeyDisplay: React.FC<KeyDisplayProps> = ({ activeKeys }) => {
    const keyMap = {
        w: 'Move In',
        s: 'Move Out',
        a: 'Orbit Left',
        d: 'Orbit Right',
        q: 'Move Down',
        e: 'Move Up',
        x: 'Reset View'
    };

    const activeKeysList = Object.entries(activeKeys)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
    
    if (activeKeysList.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-2">
            {activeKeysList.map(key => (
                <div key={key} 
                     className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm 
                               px-3 py-2 rounded-lg border border-slate-600/50">
                    <kbd className="px-2 py-1 bg-slate-700 text-white rounded-md font-bold uppercase">
                        {key}
                    </kbd>
                    <span className="text-white/70 text-sm">
                        {keyMap[key as keyof typeof keyMap]}
                    </span>
                </div>
            ))}
        </div>
    );
};