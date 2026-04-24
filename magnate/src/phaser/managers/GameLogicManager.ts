import { GameModel } from '@/phaser/models/GameModel';
import { GameState } from '@/services/types/socket';
import { EventBus } from '@/EventBus';

export class GameLogicManager {
    private static instance: GameLogicManager;
	private populated: boolean = false;
    public model: GameModel;

    private constructor() {
        this.model = new GameModel();
        this.setupCentralListeners();
    }

    public static getInstance(): GameLogicManager {
        if (!GameLogicManager.instance) {
            GameLogicManager.instance = new GameLogicManager();
        }
        return GameLogicManager.instance;
    }

    private setupCentralListeners() {
        // -- Game State
        EventBus.on('new-game-state', async (new_state: GameState) => {
            console.log("Manager: Received new state", new_state.id);
			if (!this.populated) {
                await this.model.populate(new_state);
				this.populated = true;
			} else {
            	this.model.updateState(new_state);
			}
            EventBus.emit('model-updated', this.model);
        });

        EventBus.on('report-response-throw-dices', (data: any) => {
            // TODO: --- inicio dados
            console.log("Manager: Rolling dices...", data);
            EventBus.emit('trigger-dice-roll', {
                dice1: data.dice1,
                dice2: data.dice2,
                dice_bus: data.dice_bus,
                destinations: data.destinations || []
            });

            
            if (data.destinations?.length === 1) {
            console.log("Manager: Square forced, waiting for dice to land...");

            EventBus.once('dice-roll-complete', () => {
                setTimeout(() => {
                    const movingPlayerId = String(data.active_turn_player); 
                    if (data.path && data.path.length > 0) {
                        const finalDestination = data.path[data.path.length - 1]; 
                        this.model.updatePlayerPosition(movingPlayerId, String(finalDestination).padStart(3, '0'));
                    }
        
                    EventBus.emit('clear-dice'); 
        
                    EventBus.emit('view-animate-path', {
                        playerId: movingPlayerId,
                        path: data.path,
                    });
                    
                    EventBus.emit('model-updated', this.model);
                }, 1800);
            });

        }
            
            EventBus.emit('model-updated', this.model);
        });

        EventBus.on('report-response-choose-square', (data: any) => {
            console.log("Manager: Square chosen...", data);
        
            const movingPlayerId = String(data.active_turn_player); 
            if (data.path && data.path.length > 0) {
                const finalDestination = data.path[data.path.length - 1]; 
                this.model.updatePlayerPosition(movingPlayerId, String(finalDestination).padStart(3, '0'));
            }
        
            EventBus.emit('clear-dice'); 
        
            EventBus.emit('view-animate-path', {
                playerId: movingPlayerId,
                path: data.path,
            });
        
            EventBus.emit('model-updated', this.model);
        });

        EventBus.on('report-response', (data: any) => {
            this.model.active_phase_player = data.active_phase_player;
            this.model.active_turn_player = data.active_turn_player;
            this.model.phase = data.phase;

            console.log("eeeeey", this.model);
        });

		EventBus.on('pause-game', () => {
			this.model.isPaused = true;
            EventBus.emit('model-updated', this.model);
			// whatevs you need now (?) TODO
		});
    }
}
