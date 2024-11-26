import React from 'react';
import { useSimulationStore } from '../store/simulationStore';

export const RadiusToggle: React.FC = () => {
    const { radiusScale, setRadiusScale } = useSimulationStore();

    const scales = [
        { value: 0.1, label: '0.1×' },
        { value: 0.5, label: '0.5×' },
        { value: 1, label: '1×' },
        { value: 2, label: '2×' },
        { value: 5, label: '5×' }
    ];

    return (
        <div className="flex flex-col items-start">
            <span className="text-white/70 text-sm mb-2 ml-2">Orbit Scale</span>
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-full 
                          shadow-lg border border-slate-600/50 flex overflow-hidden">
                {scales.map((scale) => (
                    <button
                        key={scale.value}
                        onClick={() => setRadiusScale(scale.value)}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200
                                  ${radiusScale === scale.value 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-white/80 hover:bg-slate-700/80'}`}
                    >
                        {scale.label}
                    </button>
                ))}
            </div>
        </div>
    );
};