import React, { useState, useEffect } from "react";
import { Scene } from "./components/Scene";
import { Tooltip } from "./components/Tooltip";
import { PlanetContext } from "./context/PlanetContext";
import { PlanetData } from "./types/types";

const SolarSystem = () => {
    const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);

    useEffect(() => {
        const handleMouseWheel = (event: WheelEvent) => {
            // Handle the mouse wheel event
            console.log("Mouse wheel event detected:", event);
        };

        window.addEventListener('mousewheel', handleMouseWheel, { passive: true });

        return () => {
            window.removeEventListener('mousewheel', handleMouseWheel);
        };
    }, []);

    return (
        <PlanetContext.Provider value={{ hoveredPlanet, setHoveredPlanet }}>
            <div className="w-full h-screen relative">
                <Scene hoveredPlanet={hoveredPlanet} />
                <Tooltip hoveredPlanet={hoveredPlanet} />
            </div>
        </PlanetContext.Provider>
    );
};

export default SolarSystem;
