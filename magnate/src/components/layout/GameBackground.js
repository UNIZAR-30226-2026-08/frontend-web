import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EventBus } from '@/EventBus';
const CameraSync = () => {
    const { camera } = useThree();
    useEffect(() => {
        const handleSync = (data) => {
            const pixelTo3DScale = 78;
            const offsetX = (data.x - 960) / pixelTo3DScale;
            const offsetY = (data.y - 540) / pixelTo3DScale;
            camera.position.x = offsetX;
            camera.position.z = offsetY;
            camera.zoom = data.zoom;
            camera.updateProjectionMatrix();
        };
        EventBus.on('sync-3d-camera', handleSync);
        return () => { EventBus.off('sync-3d-camera', handleSync); };
    }, [camera]);
    return null;
};
const AnimatedModel = () => {
    /*
const { scene, animations } = useGLTF('/models/fondo.glb');
const { actions } = useAnimations(animations, scene);

useEffect(() => {
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0 && actions[actionNames[0]]) {
        actions[actionNames[0]].play();
    }
}, [actions]);

return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
*/
};
export const GameBackground = () => {
    return (_jsx("div", { className: "absolute inset-0 z-0 pointer-events-none", children: _jsxs(Canvas, { camera: { position: [0, 11, 0], rotation: [-Math.PI / 2, 0, 0], fov: 75 }, children: [_jsx("ambientLight", { intensity: 1.5 }), _jsx("directionalLight", { position: [10, 10, 10], intensity: 2 }), _jsx(CameraSync, {})] }) }));
};
useGLTF.preload('/models/fondo.glb');
