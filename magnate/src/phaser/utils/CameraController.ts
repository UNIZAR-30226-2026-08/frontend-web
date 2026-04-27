import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { EventBus } from '@/EventBus';

export class CameraController {
    private scene: Phaser.Scene;
    public mainCam: Phaser.Cameras.Scene2D.Camera;
    //public uiCam: Phaser.Cameras.Scene2D.Camera;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        
        // Cámara principal, es la que ya existe por defecto
        this.mainCam = scene.cameras.main;
        this.mainCam.setBounds(-100, -100, 10000, 10000);
    }

    public followToken(token: any, zoom: number = 2.2, onArrived?: () => void) {
        this.mainCam.stopFollow();

        const duration = 1000;
        //const radians = Phaser.Math.DegToRad(degrees);

        this.mainCam.pan(token.x, token.y, duration, "Cubic.easeInOut");
        this.mainCam.zoomTo(zoom, 1500, "Cubic.easeInOut");

        this.scene.tweens.add({
            targets: this.mainCam,

            duration: duration,
            ease: 'Cubic.easeInOut'
        });

        this.mainCam.once('camerapancomplete', () => {
            this.mainCam.startFollow(token, true, 0.08, 0.08);
            EventBus.emit('camera-ready');
            if (onArrived) { onArrived(); }
        });
    }

    public focusOnTile(tile: Tile, zoom: number = 1, onComplete?: () => void) {
        this.mainCam.stopFollow();
        this.mainCam.pan(tile.x, tile.y, 1500,  "Cubic.easeInOut");
        this.mainCam.zoomTo(zoom, 1500, "Cubic.easeInOut");
        
        if (onComplete) {
            this.mainCam.once('camerapancomplete', () => {
                onComplete();
            });
        }
    }

    public resetView(duration: number = 1200) {
        this.mainCam.stopFollow();
        
        this.mainCam.pan(960, 540, duration, "Cubic.easeInOut");
        this.mainCam.zoomTo(1, duration, "Cubic.easeInOut");
        this.scene.tweens.add({
            targets: this.mainCam,
            duration: duration,
            ease: 'Cubic.easeInOut'
        });
    }
}