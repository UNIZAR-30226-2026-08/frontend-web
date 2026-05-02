import * as Phaser from 'phaser';
import { EventBus } from '@/EventBus';

export class PlayerToken extends Phaser.GameObjects.Container {
    public isMoving: boolean = false;
    public static hudPositions: Record<string, { x: number, y: number }> = {};

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene, x, y);
        const shadow = scene.add.ellipse(3, 3, 40, 40, 0x000000, 0.3);
        const body = scene.add.ellipse(0, 0, 40, 40, color).setStrokeStyle(3, 0xffffff);
        this.add([shadow, body]);
        this.setDepth(100); 
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 21), Phaser.Geom.Circle.Contains);
        scene.add.existing(this);

        const handlePositionsUpdate = (domPositions: Record<string, { x: number, y: number }>) => {
            const convertedPositions: Record<string, { x: number, y: number }> = {};
            
            // Hay que convertir las coordenadas de React a las de Phaser
            const canvas = this.scene.game.canvas;
            const rect = canvas.getBoundingClientRect();

            const scaleX = this.scene.scale.gameSize.width / rect.width;
            const scaleY = this.scene.scale.gameSize.height / rect.height;
            
            Object.entries(domPositions).forEach(([id, domPos]) => {
                const canvasX = (domPos.x - rect.left) * scaleX;
                const canvasY = (domPos.y - rect.top) * scaleY;
                
                convertedPositions[id] = { x: canvasX, y: canvasY };
            });

            PlayerToken.hudPositions = convertedPositions;
        };

        EventBus.on('player-hud-positions', handlePositionsUpdate);

        this.on('destroy', () => {
            EventBus.off('player-hud-positions', handlePositionsUpdate);
        });
    }

    public moveToCoords(path: { x: number, y: number }[], onComplete?: () => void) {
        if (!path || path.length === 0) {
            onComplete?.();
            return;
        }
        this.isMoving = true;
        const nextTarget = path.shift();

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
