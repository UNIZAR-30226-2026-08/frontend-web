import { PlayerModel } from './PlayerModel';
import { PropertyModel } from './PropertyModel';
import { PropertyInfo, Phase, GameState } from "@/services/types/socket"
//import { useAuth } from '@/context/AuthContext';

// TODO: esto es de momento, se queja porque el fichero esta en javaScript
// @ts-ignore 
import { fetchUserNamePiece } from '@/api/userServices'; 

export class GameModel {
    public gameId: string = "";
	// public active_phase_player: string = "waiting-for-players";	// sup. ID
	// public active_turn_player: string = "waiting-for-players";	// sup. ID
	public active_phase_player: number = 0;	// sup. ID
	public active_turn_player: number = 0;	// sup. ID
	public phase: Phase = "business";	// other than roll the dices
	public streak: number = 0; //nº of doubles hits 3 -> go to jail
	public parking_money : number = 0;
	public current_turn : number = 0;	// round number

    public isPaused: boolean = false; // otro para isFinished?
    public boardProperties: Record<string, PropertyModel> = {}; // Record es como un diccionario https://typescriptutorial.com/es/diccionarios/
    public players: Record<string, PlayerModel> = {};
	public orderedPlayers: string[] = [];

    public updateState(new_state: GameState) { 
		this.active_phase_player = new_state.active_phase_player;
        this.active_turn_player = new_state.active_turn_player;
        this.phase = new_state.phase;
        this.streak = new_state.streak;
        this.parking_money = new_state.parking_money;
        this.current_turn = new_state.current_turn;

		this.orderedPlayers.forEach((playerId) => {
            const player = this.players[playerId];
            
            if (player) {
                // Actualizamos su dinero y posición actual
                player.balance = new_state.money[playerId] || 0;
                player.currentTileId = new_state.positions[playerId];
                
                // Actualizamos sus turnos en la cárcel
                player.jailRemainingTurns = new_state.jail_remaining_turns[playerId] || 0;

                // Actualizamos lista de IDs de sus propiedades 
                player.properties = new_state.property_relationships
                    .filter(p => String(p.owner) === playerId)
                    .map(p => p.square);
            }
        });

		new_state.property_relationships.forEach((propInfo) => {
            this.boardProperties[propInfo.square] = new PropertyModel(propInfo);
        });

	}

	public async populate(new_state: GameState) {
		//const { fetchUserNamePiece } = useAuth();

		// Initial setting
		this.gameId = new_state.id;
		this.active_phase_player = new_state.active_phase_player;
		this.active_turn_player = new_state.active_turn_player;
		this.phase = new_state.phase;
		this.streak = new_state.streak;
		this.parking_money = new_state.parking_money;
		this.current_turn = new_state.current_turn;
		this.isPaused = false; // TODO ?
		this.orderedPlayers = new_state.ordered_players.map(id => String(id));
		
		// const fullData = this.cache.json.get('board');
		// const rawColors = fullData.playerColors as string[];
		// const colorPalette = rawColors.map(c => parseInt(c.replace('#', '0x')));
		// const colorIndex :number = 0;
		
		//const ascendingSortedPlayers = Object.keys(new_state.players) => a.localeCompare(b));

		const peticiones = this.orderedPlayers.map((playerId) => {
            return new Promise<void>((resolve) => {
                
                fetchUserNamePiece(playerId, (data : any) => {
                    // En cuanto llega el nombre, creamos el PlayerModel  con el nombre real
                    const finalName = (data && data.username) ? data.username : "Jugador";
                    const player = new PlayerModel(playerId, finalName, 0xffffff);

                    player.balance = new_state.money[playerId];
                    player.currentTileId = new_state.positions[playerId];
                    player.jailRemainingTurns = new_state.jail_remaining_turns[playerId] || 0;
                    player.properties = new_state.property_relationships.filter(p => String(p.owner) === playerId).map(p => p.square);
                    
					this.players[playerId] = player;
                    
                    resolve();
                });
            });
        });
		await Promise.all(peticiones);

		new_state.property_relationships.forEach((propInfo) => {
			this.boardProperties[propInfo.square] = new PropertyModel(propInfo);
		});
    }

}
