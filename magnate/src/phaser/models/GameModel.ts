import { PlayerModel } from './PlayerModel';
import { PropertyModel } from './PropertyModel';
import { PropertyInfo, Phase, GameState } from "@/services/types/socket"
import { useAuth } from '@/context/AuthContext';

export class GameModel {
    public gameId: string = "";
	public active_phase_player: string = "waiting-for-players";	// sup. ID
	public active_turn_player: string = "waiting-for-players";	// sup. ID
	public phase: Phase = "business";	// other than roll the dices
	public streak: number = 0; //nº of doubles hits 3 -> go to jail
	public parking_money : number = 0;
	public current_turn : number = 0;	// round number

    public isPaused: boolean = false; // otro para isFinished?
    public boardProperties: Record<string, PropertyModel> = {}; // Record es como un diccionario https://typescriptutorial.com/es/diccionarios/
    public players: Record<string, PlayerModel> = {};

    public updateState(new_state: GameState) { 

	}

	public populate(new_state: GameState) {
		const { fetchUserNamePiece } = useAuth();

		// Initial setting
		this.gameId = new_state.id;
		this.active_phase_player = new_state.active_phase_player;
		this.active_turn_player = new_state.active_turn_player;
		this.phase = new_state.phase;
		this.streak = new_state.streak;
		this.parking_money = new_state.parking_money;
		this.current_turn = new_state.current_turn;
		this.isPaused = false; // TODO ?
		
		const fullData = this.cache.json.get('board');
		const rawColors = fullData.playerColors as string[];
		const colorPalette = rawColors.map(c => parseInt(c.replace('#', '0x')));
		const colorIndex :number = 0;
		const ascendingSortedPlayers = Object.keys(new_state.players).sort((a,b) => a.localCompare(b));
		ascendingSortedPlayers.forEach((playerId) => {
			fetchUserNamePiece(playerId, (data : any) => {
				player = new PlayerModel(playerId, data.username, colorPalette[colorIndex]); 
				colorIndex = colorIndex + 1;
				player.balance = new_state.money[playerId];
				player.currentTileId = new_state.positions[playerId];
				player.jailRemainingTurns = (playerId === new_state.active_turn_player) ? new_state.jail_remaining_turns : 0;

				player.properties = new_state.property_relationships.filter(p => p.owner === playerId).map(p => p.square);

				this.players[playerId] = player;
			});
		});

		new_state.property_relationships.forEach((propInfo) => {
			this.boardProperties[propInfo.square] = new PropertyModel(propInfo);
		});
    }

}
