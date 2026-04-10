export type FantasyEventType = 'WIN_PLAIN_MONEY'
| 'WIN_RATIO_MONEY';

export type Phase = 'ROLL_THE_DICES'
| 'CHOOSE_SQUARE';

export type BotLevel = 'VERY_EASY' | 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD' | 'EXPERT';

// Nico: ConnState: internal state of the WS client (en vdd interesa para
// permitir o no ciertas operaciones)

export interface GameAction {
    type: string;
    //game: number; 	// server puts them
    //player: number;
    square?: number;
}

export interface GameResponse {
    type: string;
    // TODO: faltan

}
