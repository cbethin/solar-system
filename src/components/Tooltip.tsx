
import React from "react";
import { PlanetData } from "../types/types";

interface TooltipProps {
    hoveredPlanet: PlanetData | null;
}

export const Tooltip: React.FC<TooltipProps> = ({ hoveredPlanet }) => {
    if (!hoveredPlanet) return null;

    return (
        <div className="absolute bottom-4 left-4 bg-gray-800/90 text-white px-4 py-3 rounded text-sm">
            <div className="font-bold mb-1">{hoveredPlanet.name}</div>
            <div className="space-y-1">
                <div>Orbital Period: {hoveredPlanet.period.toFixed(2)} Earth years</div>
                <div>
                    Distance from Sun: {hoveredPlanet.distanceFromSun.toFixed(2)} AU
                </div>
                <div>Eccentricity: {hoveredPlanet.eccentricity.toFixed(4)}</div>
                <div>Relative Size: {hoveredPlanet.size}x</div>
            </div>
        </div>
    );
};