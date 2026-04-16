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
        EventBus.on('new-game-state', (new_state: GameState) => {
            console.log("Manager: Received new state", new_state.id);
			if (!populated) {
				this.model.populate(new_state);
				this.populated = true;
			}
			else {
            	this.model.updateState(new_state);
			}
            
            EventBus.emit('model-updated', this.model);
        });
		EventBus.on('pause-game', () => {
			this.model.isPaused = true;
			// whatevs you need now (?) TODO
		});
    }

    public getPlayer(id: string) {
        return this.model.players[id];
    }

	public getPlayersIds() : string[] {
		return Object.keys(this.players).sort((a,b) => a.localCompare(b));
	}

	public getPropertyOwner(propertyId: string): string | null {
        return this.model.boardProperties[propertyId].ownerId;
    }
}
