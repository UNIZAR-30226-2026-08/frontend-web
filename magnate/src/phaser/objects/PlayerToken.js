import * as Phaser from 'phaser';
import { EventBus } from '@/EventBus';
export class PlayerToken extends Phaser.GameObjects.Container {
    constructor(scene, x, y, color) {
        super(scene, x, y);
        const shadow = scene.add.ellipse(3, 3, 40, 40, 0x000000, 0.3);
        const body = scene.add.ellipse(0, 0, 40, 40, color).setStrokeStyle(3, 0xffffff);
        this.add([shadow, body]);
        this.setDepth(100);
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 21), Phaser.Geom.Circle.Contains);
        scene.add.existing(this);
    }
    moveToCoords(path, onComplete) {
        if (!path || path.length === 0) {
            onComplete?.();
            return;
        }
        const nextTarget = path.shift();
        // Trigger the React Audio Context via EventBus
        EventBus.emit('play-sfx', 'player_token_hop');
        this.scene.tweens.add({
            targets: this,
            x: nextTarget.x,
            y: nextTarget.y,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
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
