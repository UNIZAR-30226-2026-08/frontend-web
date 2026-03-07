import { Tile } from '../objects/Tile';

export const BoardEffects = {

    setFocusByIds: (allTiles: Tile[], targetIds: string[] | null, scene: Phaser.Scene) => {
       
        const isSelectionMode = targetIds !== null;

        allTiles.forEach(tile => {
            const isTarget = !isSelectionMode || targetIds.includes(tile.tileConfig.id);

            // overlay por encima de todo
            tile.bringToTop(tile.overlay);
            
            if (!isTarget) tile.overlay.setVisible(true);
            
            scene.tweens.add({
                targets: tile.overlay,
                alpha: isTarget ? 0 : 0.75,
                duration: 300,
                ease: 'Cubic.easeOut',
            });

            tile.setDepth(isTarget && isSelectionMode ? 100 : 1);
        });
    }
};

//------------------------------------------------- Para debugear oscuridad casillas en Board.ts
// this.input.keyboard.on('keydown-T', () => {
//     const testIds = this.tiles.slice(0, 11).map(t => t.tileConfig.id);
//     BoardEffects.setFocusByIds(this.tiles, testIds, this);
// });

// this.input.keyboard.on('keydown-R', () => {
//     BoardEffects.setFocusByIds(this.tiles, null, this);
// });