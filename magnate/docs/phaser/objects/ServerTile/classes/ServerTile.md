[**Documentación Técnica (Markdown)**](../../../../README.md)

***

[Documentación Técnica (Markdown)](../../../../modules.md) / [phaser/objects/ServerTile](../README.md) / ServerTile

# Class: ServerTile

Defined in: [phaser/objects/ServerTile.ts:4](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/ServerTile.ts#L4)

## Extends

- [`Tile`](../../Tile/classes/Tile.md)

## Constructors

### Constructor

> **new ServerTile**(`scene`, `config`): `ServerTile`

Defined in: [phaser/objects/ServerTile.ts:8](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/ServerTile.ts#L8)

#### Parameters

##### scene

`Scene`

##### config

[`IServerTile`](../../../types/TileTypes/interfaces/IServerTile.md)

#### Returns

`ServerTile`

#### Overrides

[`Tile`](../../Tile/classes/Tile.md).[`constructor`](../../Tile/classes/Tile.md#constructor)

## Properties

### background

> `protected` **background**: `Image` \| `Rectangle`

Defined in: [phaser/objects/Tile.ts:7](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/Tile.ts#L7)

#### Inherited from

[`Tile`](../../Tile/classes/Tile.md).[`background`](../../Tile/classes/Tile.md#background)

***

### nameText

> `protected` **nameText**: `Text`

Defined in: [phaser/objects/Tile.ts:6](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/Tile.ts#L6)

#### Inherited from

[`Tile`](../../Tile/classes/Tile.md).[`nameText`](../../Tile/classes/Tile.md#nametext)

***

### overlay

> **overlay**: `Rectangle`

Defined in: [phaser/objects/Tile.ts:8](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/Tile.ts#L8)

#### Inherited from

[`Tile`](../../Tile/classes/Tile.md).[`overlay`](../../Tile/classes/Tile.md#overlay)

***

### tileConfig

> **tileConfig**: [`ITile`](../../../types/TileTypes/interfaces/ITile.md)

Defined in: [phaser/objects/Tile.ts:5](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/Tile.ts#L5)

#### Inherited from

[`Tile`](../../Tile/classes/Tile.md).[`tileConfig`](../../Tile/classes/Tile.md#tileconfig)

## Methods

### setOwnerMarker()

> **setOwnerMarker**(`playerColor`): `void`

Defined in: [phaser/objects/ServerTile.ts:18](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/ServerTile.ts#L18)

#### Parameters

##### playerColor

`number`

#### Returns

`void`
