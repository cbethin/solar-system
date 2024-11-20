import React from "react";
import { PlanetData } from "../types/types";

interface TooltipProps {
    hoveredPlanet: PlanetData | null;
    selectedPlanet: PlanetData | null;
}

export const Tooltip: React.FC<TooltipProps> = ({ hoveredPlanet, selectedPlanet }) => {
    const planetToShow = selectedPlanet || hoveredPlanet;
    if (!planetToShow) return null;

    return (
        <div className={`absolute bottom-4 left-4 bg-gray-800/90 text-white px-4 py-3 rounded text-sm ${selectedPlanet ? 'ring-2 ring-white/50' : ''}`}>
            <div className="font-bold mb-1">{planetToShow.name}</div>
            <div className="space-y-1">
                <div>Orbital Period: {planetToShow.period.toFixed(2)} Earth years</div>
                <div>
                    Distance from Sun: {planetToShow.distanceFromSun.toFixed(2)} AU
                </div>
                <div>Eccentricity: {planetToShow.eccentricity.toFixed(4)}</div>
                <div>Relative Size: {planetToShow.size}x</div>
            </div>
            {selectedPlanet && (
                <div className="mt-2 text-xs text-gray-300">Press X to reset view</div>
            )}
        </div>
    );
};