import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { GameConfig } from '../../phaser/config';

export const PhaserGame = () => {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        // Evitamos crear múltiples instancias en modo desarrollo
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game(GameConfig);
        }

        // Al desmontar el componente, destruimos el juego para liberar memoria
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="flex items-center justify-center w-screen h-screen overflow-hidden bg-[var(--color-primary)]">
            <div id="phaser-container" 
            className="flex items-center justify-center w-full h-full [&>canvas]:mx-auto" />
        </div>
    );
};