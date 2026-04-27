// Types and interfaces for Tiles

// Enum for different types of tiles on the board
export enum TileType {  
    PROPERTY = 'property',
    FANTASY = 'fantasy',
    BRIDGE = 'bridge',
    SERVER = 'server',
    START = 'start',
    JAIL = 'jail',
    PARKING = 'parking',
    GO_TO_JAIL = 'go_to_jail',
    TRAM = 'tram',
    VISIT = 'visit',
}

// Interface for a tile on the board
export interface ITile {
    id : string;
    name : string;
    type: TileType;
    index : number;
    x : number;
    y : number;
    group? : number;
    rotation? : number;
    width?: number;
    height?: number;
    ownerId?: string | null;
}

// Interface for a property tile
export interface IPropertyTile extends ITile {
    type: TileType.PROPERTY; 
    price: number;
    color: string;
    rent?: number; 
    //ownerId?: string | null; // Puntero al jugador
}

// Interface for a fantasy tile
export interface IFantasyTile extends ITile {
    type: TileType.FANTASY; 
    color: string;
    icon: string;
}
export interface IBridgeTile extends ITile {
    type: TileType.BRIDGE;
    icon?: string;
	rent?: number;	// TODO preguntar backend
	//ownerId?: string | null;
	price: number;
}

export interface IServerTile extends ITile {
    type: TileType.SERVER;
    icon?: string;
	rent?: number;	// TODO preguntar backend
	//ownerId?: string | null;
	price: number;
}

export interface IStartTile extends ITile {
    type: TileType.START;
    icon?: string;
}

export interface IJailTile extends ITile {
    type: TileType.JAIL;
    icon?: string;
}

export interface IGoToJailTile extends ITile {
    type: TileType.GO_TO_JAIL;
    icon?: string;
}

export interface IVisitTile extends ITile {
    type: TileType.VISIT;
}

export interface IParkingTile extends ITile {
    type: TileType.PARKING;
    icon?: string;
    subText: string;
}

export interface ITramTile extends ITile {
    type: TileType.TRAM;
    icon?: string;
    subText: string;
}


export type TileConfig = IPropertyTile | IFantasyTile | IBridgeTile | IServerTile | IStartTile | ITramTile | IGoToJailTile | IJailTile | IParkingTile | IVisitTile  ;
