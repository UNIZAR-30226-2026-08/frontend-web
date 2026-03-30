import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';


export class CameraController {
    private scene: Phaser.Scene;
    public mainCam: Phaser.Cameras.Scene2D.Camera;
    //public uiCam: Phaser.Cameras.Scene2D.Camera;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        
        // Cámara principal, es la que ya existe por defecto
        this.mainCam = scene.cameras.main;
        this.mainCam.setBounds(-100, -100, 10000, 10000);
        
        // cámara que estará en el origen
        //this.uiCam = scene.cameras.add(0, 0, 1920, 1080);
        //this.uiCam.setScroll(0, 0); // fijar posición, nunca se desplaza
    }

    public followToken(token: any, zoom: number = 2.2, degrees: number = 0,  onArrived?: () => void) {
        this.mainCam.stopFollow();

        const duration = 1000;
        //const radians = Phaser.Math.DegToRad(degrees);

        this.mainCam.pan(token.x, token.y, duration, "Cubic.easeInOut");
        this.mainCam.zoomTo(zoom, 1500, "Cubic.easeInOut");

        this.scene.tweens.add({
            targets: this.mainCam,
            // rotation: - radians,
            duration: duration,
            ease: 'Cubic.easeInOut'
        });

        this.mainCam.once('camerapancomplete', () => {
            this.mainCam.startFollow(token, true, 0.08, 0.08);
            if (onArrived) { onArrived(); }
        });
    }

    public focusOnTile(tile: Tile, zoom: number = 1) {
        this.mainCam.stopFollow();
        this.mainCam.pan(tile.x, tile.y, 1500,  "Cubic.easeInOut");
        this.mainCam.zoomTo(zoom, 1500, "Cubic.easeInOut");
    }

    public resetView(duration: number = 1200) {
        this.mainCam.stopFollow();
        
        this.mainCam.pan(960, 540, duration, "Cubic.easeInOut");
        this.mainCam.zoomTo(1, duration, "Cubic.easeInOut");
        this.scene.tweens.add({
            targets: this.mainCam,
            //rotation: 0,
            duration: duration,
            ease: 'Cubic.easeInOut'
        });
    }
}