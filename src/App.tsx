import React, { useState, useEffect } from "react";
import { Scene } from "./components/Scene";
import { Tooltip } from "./components/Tooltip";
import { SizeToggle } from "./components/SizeToggle";
import { SpeedControl } from "./components/SpeedControl"; // Add this import
import { RadiusToggle } from "./components/RadiusToggle"; // Add this import
import { PlanetContext } from "./context/PlanetContext";
import { PlanetData } from "./types/types";

const SolarSystem = () => {
    const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);
    const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

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
        <PlanetContext.Provider value={{ 
            hoveredPlanet, 
            selectedPlanet,
            setHoveredPlanet,
            setSelectedPlanet 
        }}>
            <div className="w-full h-screen relative">
                <Scene 
                    hoveredPlanet={hoveredPlanet}
                    setSelectedPlanet={setSelectedPlanet}
                />
                <Tooltip 
                    hoveredPlanet={hoveredPlanet}
                    selectedPlanet={selectedPlanet}
                />
                <div className="fixed bottom-4 left-4 right-4 flex justify-center gap-4 overflow-x-auto pb-2">
                    <SpeedControl />
                    <SizeToggle />
                    <RadiusToggle />
                </div>
            </div>
        </PlanetContext.Provider>
    );
};

export default SolarSystem;
