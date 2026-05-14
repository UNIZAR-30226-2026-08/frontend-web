import * as Phaser from 'phaser';
import { EventBus } from '@/EventBus';
import { create3DDice } from '../objects/Dice3D';
import { create3DDiceBus } from '../objects/DiceBus3D';
import { BoardEffects } from '../utils/BoardEffects';
import { Tile } from '../objects/Tile';
import { PlayerModel } from '../models/PlayerModel';
import { PlayerToken } from '../objects/PlayerToken';

export class DiceManager {
    private board: any;
    private isRolling: boolean = false;
    private currentDice: any[] = [];
    private diceBg: any = null;
    private lastJailDestinations: string[] = [];

    constructor(board: any) {
        this.board = board;
        EventBus.on('clear-jail-dice', this.clearDice, this);
        EventBus.on('clear-dice', this.clearDice, this);
        EventBus.on('jail-re-enable-selection', this.reEnableJailInteraction, this);
    }

	public destroy() {
		EventBus.off('clear-jail-dice', this.clearDice, this);
        EventBus.off('clear-dice', this.clearDice, this);
        EventBus.off('jail-re-enable-selection', this.reEnableJailInteraction, this);
		this.clearDice();
		// Clear geometry
		this.currentDice?.forEach((die: any) => {
			die.destroy?.();
		});
		//
		this.currentDice = [];
		this.diceBg?.destroy?.();
		this.diceBg = null;
	}

    public handleDiceRoll(
        tiles: Tile[], 
        players: { model: PlayerModel, token: PlayerToken }[], 
        forcedValues?: [number, number, number],
        destinations?: string[],
        isMyTurn?: boolean
    ) {
        if (this.isRolling) return;

        this.board.hideUI();
        this.isRolling = true;

        EventBus.emit('play-sfx', 'dice_shake');
        BoardEffects.setFocusByIds(tiles, [], this.board, players.map(p=>p.token));

        const dice1 = create3DDice(960 - 220, 540, this.board, 1000);
        const dice2 = create3DDice(960, 540, this.board, 1150); 
        const dice3 = create3DDiceBus(960 + 220, 540, this.board, 1300);

        dice1.mesh.setDepth(99999);
        dice2.mesh.setDepth(99999);
        dice3.mesh.setDepth(99999);

        this.currentDice = [dice1, dice2, dice3];

        let completedRolls = 0;
        let val1 = 0;
        let val2 = 0;
        let val3 = 0;

        const checkDone = () => {
            completedRolls++;

            if (completedRolls === 3) {
                this.board.time.delayedCall(1000, () => {
                    
                    const bgX = 40;
                    const bgY = 40;

                    if (this.diceBg) this.diceBg.destroy();

                    this.diceBg = this.board.add.graphics();
                    this.diceBg.fillStyle(0x000000, 0.7);
                    this.diceBg.fillRoundedRect(bgX, bgY, 300, 100, 16);
                    this.diceBg.setDepth(99998);
                    this.diceBg.setScrollFactor(0);
                    this.diceBg.setAlpha(0);

                    this.board.tweens.add({
                        targets: this.diceBg,
                        alpha: 1,
                        duration: 400
                    });

                    const scaleFactor = 0.4;
                    const moveDuration = 800;

                    const moveDiceToCorner = (dieObj: any, targetX: number, targetY: number, onCompleteCallback?: () => void) => {
                        this.board.tweens.add({
                            targets: dieObj.mesh,
                            x: targetX,
                            y: targetY,
                            scaleX: dieObj.mesh.scaleX * scaleFactor,
                            scaleY: dieObj.mesh.scaleY * scaleFactor,
                            scaleZ: dieObj.mesh.scaleZ * scaleFactor,
                            duration: moveDuration,
                            ease: 'Cubic.easeOut',
                            onComplete: onCompleteCallback
                        });
                    };

                    EventBus.emit('play-sfx', 'dice_throw');

                    moveDiceToCorner(dice1, bgX + 60, bgY + 50);
                    moveDiceToCorner(dice2, bgX + 150, bgY + 50);
                    
                    moveDiceToCorner(dice3, bgX + 240, bgY + 50, () => {
                        try {
                            if (destinations && destinations.length > 0) {
                                
                                BoardEffects.setFocusByIds(tiles, destinations, this.board, players.map(p=>p.token));
                    
                                if (destinations.length === 1 && isMyTurn) {
                                    
                                    tiles.forEach(tile => tile.disableInteractive());
                    
                                    this.board.time.delayedCall(800, () => {
                                        const targetId = parseInt(destinations[0], 10).toString();
                                        console.log(`Me obligan: ${targetId}`);
                                    });
                    
                                } else {
                                    tiles.forEach(tile => {
                                        tile.off('pointerdown');
                    
                                        if (destinations.includes(tile.tileConfig.id)) {
                                            
                                            if (isMyTurn) {
                                                tile.setInteractive({ useHandCursor: true }); 
                                                
                                                tile.on('pointerdown', () => {
                                                    console.log(parseInt(tile.tileConfig.id, 10).toString());
                                                    EventBus.emit('action-move-to', { square: parseInt(tile.tileConfig.id, 10).toString() });
                                                });
                                            } else {
                                                tile.disableInteractive();
                                            }
                    
                                        } else {
                                            tile.disableInteractive(); 
                                        }
                                    });
                                }
                            }
                        } catch (error) {
                            console.error(error);
                        }
                        
                        EventBus.emit('dice-roll-complete', { val1, val2, val3 });
                    });
                });
            }
        };

        dice1.roll((val: any) => { val1 = val; checkDone(); }, forcedValues?.[0]);
        dice2.roll((val: any) => { val2 = val; checkDone(); }, forcedValues?.[1]);
        dice3.roll((val: any) => { val3 = val; checkDone(); }, forcedValues?.[2]);
    }

    public handleJailDiceRoll(
        tiles: Tile[], 
        players: { model: PlayerModel, token: PlayerToken }[], 
        forcedValues?: [number, number],
        destinations?: string[],
        isMyTurn?: boolean
    ) {
        if (this.isRolling) return;
        console.log("Entrando a dados carcel");
        console.log("Entrando a dados carcel con dados:", forcedValues);
        console.log("Entrando a dados carcel con destinos:", destinations);
        this.lastJailDestinations = destinations || [];

        this.board.hideUI();
        this.isRolling = true;
        
        EventBus.emit('play-sfx', 'dice_shake');
        BoardEffects.setFocusByIds(tiles, [], this.board, players.map(p=>p.token));

        const dice1 = create3DDice(960 - 110, 540, this.board, 1000);
        const dice2 = create3DDice(960 + 110, 540, this.board, 1150); 

        dice1.mesh.setDepth(99999);
        dice2.mesh.setDepth(99999);

        this.currentDice = [dice1, dice2];

        let completedRolls = 0;
        let val1 = 0;
        let val2 = 0;

        const checkDone = () => {
            completedRolls++;

            if (completedRolls === 2) {
                this.board.time.delayedCall(1000, () => {
                    const bgX = 40;
                    const bgY = 40;

                    if (this.diceBg) this.diceBg.destroy();

                    this.diceBg = this.board.add.graphics();
                    this.diceBg.fillStyle(0x000000, 0.7);
                    this.diceBg.fillRoundedRect(bgX, bgY, 200, 100, 16);
                    this.diceBg.setDepth(99998);
                    this.diceBg.setScrollFactor(0);
                    this.diceBg.setAlpha(0);

                    this.board.tweens.add({
                        targets: this.diceBg,
                        alpha: 1,
                        duration: 400
                    });

                    const scaleFactor = 0.4;
                    const moveDuration = 800;

                    const moveDiceToCorner = (dieObj: any, targetX: number, targetY: number, onCompleteCallback?: () => void) => {

                        this.board.tweens.add({
                            targets: dieObj.mesh,
                            x: targetX,
                            y: targetY,
                            scaleX: dieObj.mesh.scaleX * scaleFactor,
                            scaleY: dieObj.mesh.scaleY * scaleFactor,
                            scaleZ: dieObj.mesh.scaleZ * scaleFactor,
                            duration: moveDuration,
                            ease: 'Cubic.easeOut',
                            onComplete: onCompleteCallback
                        });
                    };

                    EventBus.emit('play-sfx', 'dice_throw');
                    const isDouble = val1 === val2;
                    const activePlayerPair = players.find(p => p.model.id === localStorage.getItem('myId'));

                    moveDiceToCorner(dice1, bgX + 60, bgY + 50);
                    moveDiceToCorner(dice2, bgX + 150, bgY + 50, () => {
                        EventBus.emit('dice-roll-complete');
                        EventBus.emit('jail-dice-rolled', { val1, val2 });
                        
                        console.log("entrando en eventmanager para destinations");
                        if (destinations && destinations.length > 0 && isMyTurn && activePlayerPair) {
                            const turns = activePlayerPair.model.jailRemainingTurns;
                            console.log("Turnos en DiceManager:", turns);

                            if (isDouble || turns >= 3) { // caso 1: saco dobles -> salida gratis; caso 2: salgo obligatoriamente y pago
                                console.log("Saliendo de la cárcel tengo dobles");
                                activePlayerPair.model.jailRemainingTurns = 0;
                                activePlayerPair.model.emitUpdate();
                                
                                EventBus.emit('clear-dice');
                                BoardEffects.setFocusByIds(tiles, destinations, this.board, players.map(p => p.token));
                                
                            } else { // caso 3: turnos 1 y 2
                                this.setupJailInteraction(tiles, players, destinations);
                            }
                        }
                    
                    });

                });
            }
        };

        dice1.roll((val: any) => { val1 = val; checkDone(); }, forcedValues?.[0]);
        dice2.roll((val: any) => { val2 = val; checkDone(); }, forcedValues?.[1]);
    }

    private reEnableJailInteraction() {
        const players = this.board.players;
        const tiles = this.board.tiles;
        this.setupJailInteraction(tiles, players, this.lastJailDestinations);
    }

    private setupJailInteraction(tiles: Tile[], players: any[], destinations: string[]) {
        const activePlayerPair = players.find(p => p.model.id === localStorage.getItem('myId'));
        
        BoardEffects.setFocusByIds(tiles, [...destinations, '201'], this.board, players.map(p => p.token));

        tiles.forEach(tile => {
            tile.off('pointerdown');
            if (tile.tileConfig.id === '201') {
                this.board.eventManager.setupJailClick('201', 'stay', activePlayerPair?.model);
            } else if (destinations.includes(tile.tileConfig.id)) {
                this.board.eventManager.setupJailClick(tile.tileConfig.id, 'pay', activePlayerPair?.model);
            } else {
                tile.disableInteractive();
            }
        });
    }

    public clearDice() {
        if (this.currentDice.length === 0) return;

        const targets = [];
        this.currentDice.forEach(die => targets.push(die.mesh));
        
        // Esto es para que el fondo de los dados se difumine igual que los dados
        if (this.diceBg) {
            targets.push(this.diceBg);
        }

        this.board.tweens.add({
            targets: targets,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                const playerTokens = this.board.players.map((p: any) => p.token);
                
                BoardEffects.setFocusByIds(this.board.tiles, null, this.board, playerTokens);

                this.board.tiles.forEach((tile: Tile) => {
                    tile.off('pointerdown'); 
                    tile.setInteractive(); 
                });

                this.isRolling = false; 
                this.board.showUI();
                EventBus.emit("dark-mode", false);

                if (this.diceBg) {
                    this.diceBg.destroy();
                    this.diceBg = null;
                }

                this.currentDice.forEach(die => die.mesh.destroy());
                this.currentDice = [];
            }
        });
    }
}
