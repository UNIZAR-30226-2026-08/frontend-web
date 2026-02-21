// Types and interfaces for Tiles

// Enum for different types of tiles on the board
export enum TileType {  
    PROPERTY = 'property',
    SPECIAL = 'special',
    SPECIALIN = 'special_in',
    PROPERTYIN = 'property_in',
    // estas hay que pensarlas bien
    SERVER = 'server',
    START = 'start',
    JAIL = 'jail',
    PARKING = 'parking',
    GO_TO_JAIL = 'go_to_jail',
    BRIDGE = 'bridge',

}

// export enum TileSize {
//     TILE_IN = (80, 120),
//     TILE_OUT = (80, 120),
//     CORNER_IN = (80, 120),
//     CORNER_OUT = (80, 120)
// }

// Interface for a tile on the board
export interface ITile {
    id : string;
    name : string;
    type: TileType;
    index : number;
    x : number;
    y : number;
    group : string;
    rotation? : number;
}

// Interface for a property tile
export interface IPropertyTile extends ITile {
    type: TileType.PROPERTY;
    price: number;
    rent: number;
    ownerId: string | null; // Puntero al jugador
}

export interface IPropertyInTile extends ITile {
    type: TileType.PROPERTYIN;
    price: number;
    rent: number;
    ownerId: string | null; // Puntero al jugador
}

export interface ISpecialTile extends ITile {
    type: TileType.SPECIAL;
    icon: string;
}

export interface ISpecialInTile extends ITile {
    type: TileType.SPECIALIN;
}

export interface IBridgeTile extends ITile {
    type: TileType.BRIDGE;
}


export type TileConfig = IPropertyTile | ISpecialTile | IBridgeTile | ISpecialInTile | IPropertyInTile;