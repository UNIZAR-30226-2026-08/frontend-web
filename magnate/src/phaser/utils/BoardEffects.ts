import { Tile } from '../objects/Tile';

// export const BoardEffects = {

//     setFocusByIds: (allTiles: Tile[], targetIds: string[] | null, scene: Phaser.Scene) => {
       
//         const isSelectionMode = targetIds !== null;

//         allTiles.forEach(tile => {
//             const isTarget = !isSelectionMode || targetIds.includes(tile.tileConfig.id);

//             // overlay por encima de todo
//             tile.bringToTop(tile.overlay);
            
//             if (!isTarget) tile.overlay.setVisible(true);
            
//             scene.tweens.add({
//                 targets: tile.overlay,
//                 alpha: isTarget ? 0 : 0.75,
//                 duration: 300,
//                 ease: 'Cubic.easeOut',
//             });

//             tile.setDepth(isTarget && isSelectionMode ? 100 : 1);
//         });
//     }
// };


export const BoardEffects = {
    darkOverlay: null as Phaser.GameObjects.Rectangle | null,

    setFocusByIds: (allTiles: Tile[], targetIds: string[] | null, scene: Phaser.Scene, players: any[] = []) => {
        const isSelectionMode = targetIds !== null;
        const activePlayers = players || [];

        if (!BoardEffects.darkOverlay) {
            BoardEffects.darkOverlay = scene.add.rectangle(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                scene.cameras.main.width * 2,
                scene.cameras.main.height * 2,
                0x000000
            );
            BoardEffects.darkOverlay.setScrollFactor(0); 
            BoardEffects.darkOverlay.setAlpha(0);
            BoardEffects.darkOverlay.setDepth(50);
        }

        scene.tweens.add({
            targets: BoardEffects.darkOverlay,
            alpha: isSelectionMode ? 0.7 : 0,
            duration: 300,
            ease: 'Cubic.easeOut',
            onStart: () => { if (isSelectionMode) BoardEffects.darkOverlay?.setVisible(true); },
            onComplete: () => { if (!isSelectionMode) BoardEffects.darkOverlay?.setVisible(false); }
        });

        // Gestionar casillas
        allTiles.forEach(tile => {
            const isTarget = isSelectionMode && targetIds.includes(tile.tileConfig.id);
            tile.setDepth(isTarget ? 100 : 1);
        });

        activePlayers.forEach((p, index) => {
            if (isSelectionMode) {    
                p.token.setDepth(1);
                p.token.setAlpha(0.4);
            } else {
                // Volver al estado normal
                p.token.setDepth(200 + index);
                p.token.setAlpha(1);
            }
        });
    }
};