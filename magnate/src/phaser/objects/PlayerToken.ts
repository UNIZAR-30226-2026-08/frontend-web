import * as Phaser from 'phaser';
import { EventBus } from '@/EventBus';

export class PlayerToken extends Phaser.GameObjects.Container {
    public isMoving: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene, x, y);
        const shadow = scene.add.ellipse(3, 3, 40, 40, 0x000000, 0.3);
        const body = scene.add.ellipse(0, 0, 40, 40, color).setStrokeStyle(3, 0xffffff);
        this.add([shadow, body]);
        this.setDepth(100); 
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 21), Phaser.Geom.Circle.Contains);
        scene.add.existing(this);
    }

    public moveToCoords(path: { x: number, y: number }[], onComplete?: () => void) {
        if (!path || path.length === 0) {
            onComplete?.();
            return;
        }
        this.isMoving = true;
        const nextTarget = path.shift();

        // Trigger the React Audio Context via EventBus
        EventBus.emit('play-sfx', 'player_token_hop');

        this.scene.tweens.add({
            targets: this,
            x: nextTarget!.x,
            y: nextTarget!.y,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
                this.moveToCoords(path, onComplete);
            }
        });

        this.scene.tweens.add({
            targets: this.list[1],
            y: -20,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
    }
}
