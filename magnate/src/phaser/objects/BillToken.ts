import * as Phaser from 'phaser';

export class BillToken extends Phaser.GameObjects.Container {
    
    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 50, height: number = 30) {
        super(scene, x, y);

        const primaryColor = 0x008a5c;
        const secondaryColor = 0x185f48;
        const detailColor = 0xffc971;

        const body = scene.add.rectangle(0, 0, width, height, primaryColor)
            .setStrokeStyle(3, secondaryColor)
            .setInteractive();
        
        // borde del billete
        const innerFrame = scene.add.rectangle(0, 0, width - 8, height - 8)
            .setStrokeStyle(1, detailColor, 0.5);

        const centerCircle = scene.add.ellipse(0, 0, height * 0.8, height * 0.8, secondaryColor, 0.4);

        const mText = scene.add.text(0, 0, 'M', {
            fontSize: `${height * 0.6}px`,
            color: '#ffc971',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        mText.setShadow(1, 1, 'rgba(255,255,255,0.5)', 0); 

        this.add([body, innerFrame, centerCircle, mText]);
        
        this.setDepth(5000);
        scene.add.existing(this);
    }
}