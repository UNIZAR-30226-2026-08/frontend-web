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
        // this.mainCam.pan(10, 10, 800,  "Cubic.easeInOut");
        
        // cámara que estará en el origen
        //this.uiCam = scene.cameras.add(0, 0, 1920, 1080);
        //this.uiCam.setScroll(0, 0); // fijar posición, nunca se desplaza
    }

    public followToken(token: any, zoom: number = 5) {
        this.mainCam.stopFollow();
        this.mainCam.pan(token.x, token.y, 1000,  "Cubic.easeInOut");
        // this.mainCam.zoomTo(zoom, 1500, "Cubic.easeInOut");
        // this.mainCam.startFollow(token, true, 0.1, 0.1);
        this.mainCam.once('camerapancomplete', () => {
            this.mainCam.startFollow(token, true, 0.1, 0.1);
        });
    }

    public focusOnTile(tile: Tile, zoom: number = 1) {
        this.mainCam.stopFollow();
        this.mainCam.pan(tile.x, tile.y, 1500,  "Cubic.easeInOut");
        this.mainCam.zoomTo(zoom, 1500, "Cubic.easeInOut");
    }

    public resetView(duration: number = 800) {
        this.mainCam.stopFollow();
        
        this.mainCam.pan(960, 540, duration, "Cubic.easeInOut");
        this.mainCam.zoomTo(1, duration, "Cubic.easeInOut");
    }
}