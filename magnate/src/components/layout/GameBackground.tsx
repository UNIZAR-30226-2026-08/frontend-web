import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

const AnimatedModel = () => {
    const { scene, animations } = useGLTF('/models/fondo.glb'); 
    const { actions } = useAnimations(animations, scene);

    useEffect(() => {
        const actionNames = Object.keys(actions);
        console.log(actionNames);
        if (actionNames.length > 0 && actions[actionNames[0]]) {
            actions[actionNames[0]].play();
        }
    }, [actions]);

    return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
};

export const GameBackground = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas 
                    camera={{ position: [0, 11, 0], rotation: [-Math.PI / 2, 0, 0], fov: 75 }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 10]} intensity={2} />
                
                <AnimatedModel />
            </Canvas>
        </div>
    );
};

useGLTF.preload('/models/fondo.glb');
