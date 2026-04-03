export interface GameAction {
    type: string;
    game: number;
    player: number;
    square?: number;
}

export interface GameResponse {
    type: string;
    // TODO: faltan

}