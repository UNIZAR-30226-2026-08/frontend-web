import * as Phaser from 'phaser';

export class CoinToken extends Phaser.GameObjects.Container {
    
    constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 25) {
        super(scene, x, y);

        const primaryColor = 0x008a5c;
        const secondaryColor = 0x185f48;

        const shadow = scene.add.ellipse(4, 4, radius * 3, radius * 3, 0x000000, 0.3);

        const body = scene.add.ellipse(0, 0, radius * 3, radius * 3, primaryColor)
            .setStrokeStyle(4, secondaryColor);
        
        const mText = scene.add.text(0, 0, 'M', {
            fontFamily: 'LTSuperior',
            fontSize: `${radius * 1.8}px`,
            color: '#ffc971',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        mText.setShadow(1, 1, 'rgba(255,255,255,0.5)', 0); 

        this.add([shadow, body, mText]);
        this.setDepth(60); 
        this.setScale(0);
        this.setAngle(-180);

        scene.tweens.add({
            targets: this,
            scale: 1,
            angle: 0,
            duration: 500,
            ease: 'Back.easeOut'
        });

        scene.add.existing(this);
    }
}