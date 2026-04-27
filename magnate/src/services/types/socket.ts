export type FantasyEventType = 'winPlainMoney'
| 'winRatioMoney'
| 'losePlainMoney'
| 'loseRatioMoney'
| 'shareMoneyAll'
| 'everybodySendsYouMoney'
| 'doubleOrNothing'
| 'getParkingMoney'
| 'goToJail'
| 'sendToJail'
| 'everybodyToJail'
| 'shufflePositions'
| 'moveAnywhereRandom'
| 'moveOpponentAnywhereRandom'
| 'magnetism'
| 'goToStart'
| 'breakOpponentHouse'
| 'breakOwnHouse'
| 'freeHouse'
| 'reviveProperty'
| 'earthquake';

export type Phase =  //GamePhase in backend doc
		'roll_the_dices'
| 'choose_square'
| 'choose_fantasy'
| 'management'
| 'business'
| 'liquidation'
| 'auction'
| 'proposal_acceptance'
| 'end_game';

export type gameActionType = 'Action'
| 'ActionThrowDices'
| 'ActionMoveTo'
| 'ActionTakeTram'
| 'ActionDropPurchase'
| 'ActionBuySquare'
| 'ActionBuild'
| 'ActionDemolish' 
| 'ActionChooseCard'
| 'ActionSurrender'
| 'ActionTradeProposal'
| 'ActionTradeAnswer'
| 'ActionMortgageSet'
| 'ActionMortgageUnset'
| 'ActionPayBail'
| 'ActionNextPhase'
| 'ActionBid';

export type privateActionType = 'joined'
| 'player_left'
| 'ready_status'
| 'settings_changed'
| 'game_start'
| 'error'; // chat_message 

export type privateCommandType = 'ready_status'
| 'start_game'
| 'update_settings';

export type gameResponseType = 'Response'
| 'ResponseMovement' 
| 'ResponseThrowDices'
| 'ResponseChooseSquare'
| 'ResponseChooseFantasy'
| 'ResponseBonus'
| 'ResponseAuction';

export type BotLevel = 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard' 
| 'expert';

export interface FantasyCardDesc {
	fantasy_type: FantasyEventType;
	value?: number;
	card_cost: number;
}

// TODO mejorar librería websocket
// Nico: ConnState: internal state of the WS client (en vdd interesa para
// permitir o no ciertas operaciones)

export interface GameAction { 
    type: gameActionType;
	msg?: string;	// for chat messages
    square?: string; 	// tileId
	houses?: number; 	// nº of houses to build
	// only for choosing fantasy card
	chosen_revealed_card?: boolean; // True if the up-facing card is chosen
	// bid - TODO Add bid firewalls (already issue in backend)
	amount?: number;
	// trade
	destination_user?: string;	// userid
	offered_money?:	number;
	asked_money?: number;
	offered_properties?: string[];  // tile id of property location
	asked_properties?: string[];	// tile id of property location
	// trade answer
	accept?: boolean; 	// True if trade is accepted
}

export interface GameActionReport { 
	player: string;	// user id of player who sent the action
	game: string;	// game ID 
    type: gameActionType;
    square?: string; 	// tileId
	houses?: number; 	// nº of houses to build
	// only for choosing fantasy card
	chosen_revealed_card?: boolean; // True if the up-facing card is chosen
	// bid (should never send forward nor receive)
	amount?: number;
	// trade
	destination_user?: string;	// userid
	offered_money?:	number;
	asked_money?: number;
	offered_properties?: string[];  // tile id of property location
	asked_properties?: string[];	// tile id of property location
	// trade answer
	accept?: boolean; 	// True if trade is accepted
}

export interface GameResponse {
    type: gameResponseType;
	money : Record<string, number>; // Dict userid: number
	active_phase_player: number;
	active_turn_player: number;
	phase: Phase;
	parking_money?: Number;
    // movement
	path?: string[];	// list of tile ids - serves as goable tiles if ChooseSquare
	fantasy_event?: FantasyEventType;
	// throw dices
	dice1?: number;
	dice2?: number;
	dice_bus?: number;
	destinations?: string[];	// list of possible tiles to choose
	triple?: boolean;
	streak?: number;	// nº of consecutive doubles (1 if first one)
	// fantasy choose
	fantasy_result?: FantasyCardDesc; // see above
	positions? : Record<string, string>; // userid, tileid
	// auction 
	auction?: AuctionData;
	winner? : string;	// user id
	final_amount?: number;	// deprecated? well I'm not passing these
	is_tie?: boolean;		// deprecated? well I'm not passing these
	bids?: Record<string, number>; // userid, money bidded
	bonuses?: Record<string, BonusData>;
}

export interface PrivateCommand {
	command: privateCommandType;
	// toggle
	is_ready?: boolean;
	// settings
	bot_level?: BotLevel;
	target_players?: number;
}

export interface PrivateAction {
	action: privateActionType;
	room_code?: string; // after generate code API
	game_id?: string;	// game start
	message?: string;	// error
	// host settings + player joined
	bot_level?: BotLevel;
	target_players?: number;
	// common to the next ones
	owner?: string;
	is_owner?: boolean;
	// ready status update
	user?: string;
	is_ready?: boolean;
	// common to players actions
	players?: Waiters[];
	// player left only (instead of user...)
	user_left? : string; 
}
/*
 * DATA TYPES FOR DEVELOPERS
 */
export interface PrivateRoomHostSettings {
	bot_level?: BotLevel;
	target_players?: number;
}

export interface PrivateRoomOwner {
	is_owner?: boolean;
}

export interface PrivateRoomReady {
	user?: string;
	is_ready?: boolean;
}

export interface PrivateRoomPlayers {
	user?: string;
	players?: Waiters[];
}

export interface Waiters {
	username: string;
	ready_to_play: boolean;
}

export interface ChatMessageContent {
	user: string;	// username... it would be better to have player ID to check
	msg: string;
}

/*
 * Related to responses
 */
export interface GameInfoResponse {
	money : Record<string, number>; // Dict userid: number
	active_phase_player: number;
	active_turn_player: number;
	phase: Phase;
	parking_money?: Number;
	fantasy_event?: FantasyEventType;
}

export interface GameInfoMovement {
	money : Record<string, number>; // Dict userid: number
	active_phase_player: number;
	active_turn_player: number;
	phase: Phase;
	path?: string[];	// list of tile ids - serves as goable tiles if ChooseSquare
	fantasy_event?: FantasyEventType;
}

export interface GameInfoThrowDices {
	money : Record<string, number>; // Dict userid: number
	active_phase_player: number;
	active_turn_player: number;
	phase: Phase;
	path?: string[];	// list of tile ids - serves as goable tiles if ChooseSquare
	fantasy_event?: FantasyEventType;
	dice1?: number;
	dice2?: number;
	dice_bus?: number;
	destinations?: string[];	// list of possible tiles to choose
	triple?: boolean;
	streak?: number;	// nº of consecutive doubles (1 if first one)
}

export interface GameInfoFantasy {
	money : Record<string, number>; // Dict userid: number
	active_phase_player: number;
	active_turn_player: number;
	phase: Phase;
	fantasy_result: {
        fantasy_event?: FantasyCardDesc;
        result: any;
    };
	positions?: Record<string, string>; // userid, tileid
}

export interface AuctionData {
    id?: number;
    square?: string | number;
    winner?: string | number;
    final_amount?: number;
    bids?: Record<string, number>;
}

export interface GameInfoAuction {
	money : Record<string, number>; // Dict userid: number
	active_phase_player: number;
	active_turn_player: number;
	phase: Phase;
	auction: AuctionData;
}

export interface BonusData {
    display_name: string;
    bonus_amount: number;
    winners: (string | number)[]; // IDs de los jugadores que ganan este bono
}

export interface GameInfoBonus {
	money : Record<string, number>; // Dict userid: number
	active_phase_player: number;
    active_turn_player: number;
    phase: Phase;
	bonuses: Record<string, BonusData>;
}

/* 
 * Game Full State
 */
export interface PropertyInfo {
	owner : string | null;	// user id
	square: string;	// tile id
	houses: number;	// nº of houses
	mortgage: boolean;
	group: number;
	name: string;
	color: string;
}

export interface GameState {
	id : string; // Game id
	datetime : string;
	positions : Record<string,string>; 	// Dict userid : tileid	
	money : Record<string,number>; 		// Dict userid : money
	active_phase_player: number;
	active_turn_player: number;
	phase: Phase;
	players : string[];
	ordered_players : string[];
	streak : number; // hits 3 -> go to jail
	possible_destinations : Record<string,number>; 	// Dict tileid : thrown dice (e.g. bus, 3 entries. Or 0 if due to triples or tram selection)
	parking_money : number;
	jail_remaining_turns : Record<string,number>; 	// Dict userid : left turns to serve in jail
	finished : boolean; // When true, indicates the game has finished
	kick_out_task_id : string;	// (timeouts)
	next_phase_task_id:string;	// (timeouts)
	current_turn : number;	// number of passed turns (TODO should be shown somewhere hehe)
	property_relationships : PropertyInfo[]; 
}

/* 
 * Related to actions
 */
export interface GameAskSquare {
	square: string;
}

export interface GameAskHouses {
	square: string;
	houses: number;
}

export interface GameAskFantasy {
	/** True if revealed card is chosen */
	revealed: boolean; 
}

export interface GameAskTradeAnswer {
	/** True if trade is accepted */
	accept: boolean; 
}

export interface GameAskBid {
	money: number;
}

export interface GameAskTrade {
	destination_user: string;	// userid
	offered_money:	number;
	asked_money: number;
	offered_properties: string[];  // tile id of property location
	asked_properties: string[];	// tile id of property location
}

export interface GameReportSender {
	player: string;
}

export interface GameReportSquare {
	player: string;	// user id of player who sent the action
	square?: string;
}

export interface GameReportHouses {
	player: string;	// user id of player who sent the action
	square?: string;
	houses?: number;
}

export interface GameReportFantasy {
	player: string;	// user id of player who sent the action
	/** True if revealed card is chosen */
	revealed?: boolean; 
}

export interface GameReportTradeAnswer {
	//player: string;	// user id of player who sent the action
	/** True if trade is accepted */
	accept?: boolean; 
}

export interface GameReportBid {
	player: string;	// user id of player who sent the action
	money?: number;
}

export interface GameReportTradeProposal {
	player: string;	// user id of player who sent the action
	destination_user?: string;	// userid
	offered_money?:	number;
	asked_money?: number;
	offered_properties?: string[];  // tile id of property location
	asked_properties?: string[];	// tile id of property location
}

