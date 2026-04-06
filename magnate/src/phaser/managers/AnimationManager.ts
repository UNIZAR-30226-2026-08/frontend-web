import { EventBus } from '@/EventBus';
import { CoinToken } from '../objects/CoinToken';
import { BillToken } from '../objects/BillToken';
import { Tile } from '../objects/Tile';
import { PlayerToken } from '../objects/PlayerToken';

const HUD_POSITIONS: Record<string, { x: number, y: number }> = {
    "0001": { x: 1660, y: 250 },
    "0002": { x: 1660, y: 450 },
    "0003": { x: 1660, y: 650 },
    "0004": { x: 1660, y: 850 },
};

export class AnimationManager {

    constructor(private scene: Phaser.Scene) {}

    
    // Animación monedas (para parking)
    public CoinAnimation(tile: Tile, playerId: string,  players: { model: any, token: PlayerToken }[], count: number = 10) {
        const playerPair = players.find(p => p.model.id === playerId);
        if (!playerPair) return;

        const { token } = playerPair;

        for (let i = 0; i < count; i++) {
            this.scene.time.delayedCall(i * 80, () => {
                
                const coin = new CoinToken(this.scene, tile.x, tile.y, 15);
                coin.setDepth(2000);

                const jumpHeight = 150;
                const midY = tile.y - jumpHeight;
                const jumpSpread = Phaser.Math.Between(-40, 40); 
                const targetX = tile.x + jumpSpread;

                this.scene.tweens.add({
                    targets: coin,
                    x: targetX,
                    y: midY,
                    scale: 1.2,
                    duration: 600,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        coin.destroy()
                    }
                });
            });
        }
    }

    // Animación billetes (cuando los players ganan/pierden dinero)
    public BillAnimation(playerId: string, count: number = 6, textAmount?: string) {

        const hudPos = HUD_POSITIONS[playerId] || { x: this.scene.scale.width - 100, y: this.scene.scale.height / 2 };
        const isNegative = textAmount?.startsWith('-');
        const color = isNegative ? '#ff4d4d' : '#22c55e';

        for (let i = 0; i < count; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                // Creamos el billete
                const bill = new BillToken(this.scene, hudPos.x, hudPos.y, 70, 40);
                
                bill.setScrollFactor(0);
                bill.setDepth(6000);
                bill.setAlpha(1);
                bill.setScale(0.5);

                this.scene.tweens.add({
                    targets: bill,
                    x: bill.x - Phaser.Math.Between(150, 250),
                    y: bill.y + Phaser.Math.Between(-100, 100),
                    scale: 1.2,
                    angle: Phaser.Math.Between(-20, 20),
                    duration: 1000,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: bill,
                            alpha: 0,
                            y: bill.y + 50,
                            duration: 500,
                            onComplete: () => bill.destroy()
                        });
                    }
                });
            });
        }
        
        if (textAmount) { // Cantidad de dinero que se muestra
            const txt = this.scene.add.text(hudPos.x - 120, hudPos.y, textAmount, {
                fontSize: '40px',
                fontStyle: 'bold',
                color: color,
                stroke: '#000',
                strokeThickness: 5
            }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(7000);

            this.scene.tweens.add({
                targets: txt,
                x: txt.x - 40,
                alpha: 0,
                duration: 2000,
                onComplete: () => txt.destroy()
            });
        }
    }

}