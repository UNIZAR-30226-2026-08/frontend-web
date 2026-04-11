[**Documentación Técnica (Markdown)**](../../../../README.md)

***

[Documentación Técnica (Markdown)](../../../../modules.md) / [phaser/objects/PropertyTile](../README.md) / PropertyTile

# Class: PropertyTile

Defined in: [phaser/objects/PropertyTile.ts:5](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/PropertyTile.ts#L5)

## Extends

- [`Tile`](../../Tile/classes/Tile.md)

## Constructors

### Constructor

> **new PropertyTile**(`scene`, `config`): `PropertyTile`

Defined in: [phaser/objects/PropertyTile.ts:11](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/PropertyTile.ts#L11)

#### Parameters

##### scene

`Scene`

##### config

[`IPropertyTile`](../../../types/TileTypes/interfaces/IPropertyTile.md)

#### Returns

`PropertyTile`

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

### clearBuildings()

> **clearBuildings**(): `void`

Defined in: [phaser/objects/PropertyTile.ts:111](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/PropertyTile.ts#L111)

#### Returns

`void`

***

### setConstructionLevel()

> **setConstructionLevel**(`level`): `void`

Defined in: [phaser/objects/PropertyTile.ts:82](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/PropertyTile.ts#L82)

#### Parameters

##### level

`number`

#### Returns

`void`

***

### setOwnerMarker()

> **setOwnerMarker**(`playerColor`): `void`

Defined in: [phaser/objects/PropertyTile.ts:46](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/objects/PropertyTile.ts#L46)

#### Parameters

##### playerColor

`number`

#### Returns

`void`
