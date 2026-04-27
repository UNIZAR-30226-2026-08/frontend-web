// Types and interfaces for Tiles
// Enum for different types of tiles on the board
export var TileType;
(function (TileType) {
    TileType["PROPERTY"] = "property";
    TileType["FANTASY"] = "fantasy";
    TileType["BRIDGE"] = "bridge";
    TileType["SERVER"] = "server";
    TileType["START"] = "start";
    TileType["JAIL"] = "jail";
    TileType["PARKING"] = "parking";
    TileType["GO_TO_JAIL"] = "go_to_jail";
    TileType["TRAM"] = "tram";
})(TileType || (TileType = {}));
