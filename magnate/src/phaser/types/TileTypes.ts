// Types and interfaces for Tiles

// Enum for different types of tiles on the board
export enum TileType {  
    PROPERTY = 'property',
    SPECIAL = 'special',
    BRIDGE = 'bridge',
    SERVER = 'server',
    START = 'start',
    JAIL = 'jail',
    PARKING = 'parking',
    GO_TO_JAIL = 'go_to_jail',
    BRIDGE = 'bridge',
}

// Interface for a tile on the board
export interface ITile {
    id : string;
    name : string;
    type: TileType;
    index : number;
    x : number;
    y : number;
    group? : string;
    rotation? : number;
    width?: number;
    height?: number;
}

// Interface for a property tile
export interface IPropertyTile extends ITile {
    type: TileType.PROPERTY; 
    price: number;
    color: string;
    rent?: number; 
    ownerId?: string | null; // Puntero al jugador
}

export interface ISpecialTile extends ITile {
    type: TileType.SPECIAL;
    icon?: string;
}

export interface IBridgeTile extends ITile {
    type: TileType.BRIDGE;
}

export type TileConfig = IPropertyTile | ISpecialTile | IBridgeTile;
