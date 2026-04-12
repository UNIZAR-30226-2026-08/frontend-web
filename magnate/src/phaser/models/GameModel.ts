import { PlayerModel } from './PlayerModel';
import { PropertyModel } from './PropertyModel';
import { PropertyInfo, Phase, GameState } from "@/services/types/socket"

export class GameModel {
    public gameId: string;
	public active_phase_player: string;	// sup. ID
	public active_turn_player: string;	// sup. ID
	public phase: Phase;
	public streak: number; //nº of doubles hits 3 -> go to jail
	public parking_money : number;
	public current_turn : number;	// round number

    public isPaused: boolean = false; // otro para isFinished?
    public boardProperties: Record<string, PropertyModel> = {}; // Record es como un diccionario https://typescriptutorial.com/es/diccionarios/
    public players: Record<string, PlayerModel> = {};

    constructor(gameId: string, playerList: PlayerModel[], propertyIds: string[]) {
        this.gameId = gameId;
        // TODO: Va a ser interesante crear los jugadores por orden creciente
        // de valor de los dados en la primera tirada (la tirada que se hace
        // para elegir el orden de juego)
        this.currentTurnPlayerId = playerList[0]?.id || "";
        
        propertyIds.forEach(id => {
            this.boardProperties[id] = new PropertyModel(id);
        });

        playerList.forEach(player => {
            this.players[player.id] = player;
        });
    }

    public getPropertyOwner(propertyId: string): string | null {
        return this.boardProperties[propertyId].ownerId;
    }
}
