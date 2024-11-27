import React from "react";
import { PlanetData } from "../types/types";
import { useSimulationStore } from "../store/simulationStore";

interface TooltipProps {
    hoveredPlanet: PlanetData | null;
    selectedPlanet: PlanetData | null;
}

export const Tooltip: React.FC<TooltipProps> = ({ hoveredPlanet, selectedPlanet }) => {
    const showTooltip = useSimulationStore(state => state.showTooltip);
    const planetToShow = selectedPlanet || hoveredPlanet;

    // Only show if we have a planet to display AND showTooltip is true
    if (!showTooltip || !planetToShow) return null;

    return (
        <div className={`
            absolute top-4 left-4 
            bg-black/80 backdrop-blur-sm
            text-white px-5 py-4 
            rounded-lg shadow-lg 
            border border-white/10
            text-sm
            min-w-[240px]
            ${selectedPlanet ? 'ring-1 ring-white/20' : ''}
        `}>
            <div className="font-bold mb-2 text-base text-blue-200">{planetToShow.name}</div>
            <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                    <span className="text-gray-400">Orbital Period:</span>
                    <span className="text-white">{planetToShow.period.toFixed(2)} Earth years</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Distance from Sun:</span>
                    <span className="text-white">{planetToShow.distanceFromSun.toFixed(2)} AU</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Eccentricity:</span>
                    <span className="text-white">{planetToShow.eccentricity.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Relative Size:</span>
                    <span className="text-white">{planetToShow.size}x</span>
                </div>
            </div>
            {selectedPlanet && (
                <div className="mt-3 pt-2 text-xs text-gray-400 border-t border-white/10">
                    Press <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">X</kbd> to reset view
                </div>
            )}
        </div>
    );
};