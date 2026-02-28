import * as Phaser from 'phaser';

export class PlayerToken extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene, x, y);

        const shadow = scene.add.ellipse(3, 3, 40, 40, 0x000000, 0.3);
        const body = scene.add.ellipse(0, 0, 40, 40, color).setStrokeStyle(3, 0xffffff);
        
        this.add([shadow, body]);
        this.setDepth(100); 

        // TODO: Esto es solo para probar el movimiento
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 21), Phaser.Geom.Circle.Contains);

        this.on('pointerover', () => {
            this.setScale(1.1);
            scene.input.setDefaultCursor('pointer');
        });
        this.on('pointerout', () => {
            this.setScale(1.0);
            scene.input.setDefaultCursor('default');
        });
        //

        scene.add.existing(this);
    }

    public moveTo(targetX: number, targetY: number) {
        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 600,
            ease: 'Cubic.easeOut'
        });
    }
}
