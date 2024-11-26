import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useSimulationStore } from '../store/simulationStore';

export const SizeToggle: React.FC = () => {
    const { isRealisticSize, toggleSizeMode, setPlanetScale } = useSimulationStore();

    // Simplify the spring animation
    useSpring({
        to: { scale: isRealisticSize ? 1 : 5 },
        onChange: (result: any) => {
            setPlanetScale(result.value.scale);
        },
        config: { 
            mass: 2,           // Increased mass
            tension: 120,      // Reduced tension
            friction: 14,      // Reduced friction
            bounce: 0.3        // Added bounce
        }
    });

    return (
        <button
            onClick={toggleSizeMode}
            className="fixed bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full 
                     shadow-lg hover:bg-slate-700/80 transition-colors duration-200 flex items-center space-x-2
                     border border-slate-600/50"
        >
            <span className="text-sm font-medium">
                {isRealisticSize ? 'Real Size' : 'Big Size'}
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${isRealisticSize ? 'bg-blue-500' : 'bg-purple-500'}`}>
                <span className="text-xs font-bold">
                    {isRealisticSize ? '1x' : '5x'}
                </span>
            </div>
        </button>
    );
};