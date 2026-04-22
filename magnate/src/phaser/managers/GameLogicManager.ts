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
            
            EventBus.emit('model-updated', this.model);
        });

		EventBus.on('pause-game', () => {
			this.model.isPaused = true;
            EventBus.emit('model-updated', this.model);
			// whatevs you need now (?) TODO
		});
    }
}
