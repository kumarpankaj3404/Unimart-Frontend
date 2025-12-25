import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 2000, color }) {
    const points = useRef();
    const { viewport } = useThree();

    const [initialPositions] = useState(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Spread particles WIDER than the viewport (1.5x)
            // This prevents them from feeling "clumped" and ensures no gaps at edges
            pos[i * 3] = (Math.random() - 0.5) * viewport.width * 1.5;
            pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.5;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15; // z depth
        }
        return pos;
    });

    const randomOffsets = useMemo(() => {
        const offsets = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            offsets[i * 3] = Math.random() * Math.PI * 2;
            offsets[i * 3 + 1] = Math.random() * Math.PI * 2;
            offsets[i * 3 + 2] = Math.random() * 0.02 + 0.005; // Slow drift
        }
        return offsets;
    }, [count]);

    useFrame((state, delta) => {
        if (points.current) {
            const currentPositions = points.current.geometry.attributes.position.array;
            // Define boundary slightly larger than generation area for smooth wrapping
            const heightBoundary = viewport.height * 1.5;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                // Read current Y
                let y = currentPositions[i3 + 1];

                // Apply constant velocity
                const speed = randomOffsets[i3 + 2];
                y += speed * delta * 4.0;

                // Wrap around logic using the boundary
                if (y > heightBoundary / 2) {
                    y -= heightBoundary;
                }

                // Apply new Y
                currentPositions[i3 + 1] = y;
            }
            points.current.geometry.attributes.position.needsUpdate = true;

            // Global Parallax (Gentle tilt)
            const mouseX = state.mouse.x * 0.05;
            const mouseY = state.mouse.y * 0.05;
            points.current.rotation.x = -mouseY;
            points.current.rotation.y = mouseX;
        }
    });

    return (
        <group>
            <Points ref={points} positions={initialPositions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.025} // Smaller for less distraction
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4} // Lower opacity to keep it in background
                />
            </Points>
        </group>
    );
}

function Scene({ isDark }) {
    const particleColor = isDark ? "#ffffff" : "#0a4e25";
    return (
        <>
            <ParticleField count={3000} color={particleColor} />
        </>
    );
}

// Helper hook for theme detection
export function useThemeDetector() {
    const [isDark, setIsDark] = useState(false);
    React.useEffect(() => {
        const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);
    return isDark;
}

export default function Background3D() {
    const isDark = useThemeDetector();

    return (
        <div className="fixed inset-0 -z-10 bg-[#F0FDF4] dark:bg-slate-950 transition-colors duration-500 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
                <Scene isDark={isDark} />
            </Canvas>
        </div>
    );
}