import React from 'react';
import { useSimulationStore } from '../store/simulationStore';

export const SpeedControl: React.FC = () => {
    const { orbitSpeed, setOrbitSpeed } = useSimulationStore();

    const speeds = [
        { value: 0, label: '⏸' },
        { value: 0.5, label: '½×' },
        { value: 1, label: '1×' },
        { value: 2, label: '2×' },
        { value: 5, label: '5×' }
    ];

    return (
        <div className="flex flex-col items-start">
            <span className="text-white/70 text-sm mb-2 ml-2">Simulation Speed</span>
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-full 
                          shadow-lg border border-slate-600/50 flex overflow-hidden">
                {speeds.map((speed) => (
                    <button
                        key={speed.value}
                        onClick={() => setOrbitSpeed(speed.value)}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200
                                  ${orbitSpeed === speed.value 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-white/80 hover:bg-slate-700/80'}`}
                    >
                        {speed.label}
                    </button>
                ))}
            </div>
        </div>
    );
};