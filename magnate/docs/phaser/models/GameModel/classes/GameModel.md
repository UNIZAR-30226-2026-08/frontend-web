[**Documentación Técnica (Markdown)**](../../../../README.md)

***

[Documentación Técnica (Markdown)](../../../../modules.md) / [phaser/models/GameModel](../README.md) / GameModel

# Class: GameModel

Defined in: [phaser/models/GameModel.ts:4](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L4)

## Constructors

### Constructor

> **new GameModel**(`gameId`, `playerList`, `propertyIds`): `GameModel`

Defined in: [phaser/models/GameModel.ts:13](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L13)

#### Parameters

##### gameId

`string`

##### playerList

[`PlayerModel`](../../PlayerModel/classes/PlayerModel.md)[]

##### propertyIds

`string`[]

#### Returns

`GameModel`

## Properties

### boardProperties

> **boardProperties**: `Record`\<`string`, [`PropertyModel`](../../PropertyModel/classes/PropertyModel.md)\> = `{}`

Defined in: [phaser/models/GameModel.ts:10](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L10)

***

### currentTurnPlayerId

> **currentTurnPlayerId**: `string`

Defined in: [phaser/models/GameModel.ts:6](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L6)

***

### gameId

> **gameId**: `string`

Defined in: [phaser/models/GameModel.ts:5](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L5)

***

### hasRolledDice

> **hasRolledDice**: `boolean` = `false`

Defined in: [phaser/models/GameModel.ts:8](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L8)

***

### isPaused

> **isPaused**: `boolean` = `false`

Defined in: [phaser/models/GameModel.ts:9](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L9)

***

### parkingMoney

> **parkingMoney**: `number` = `0`

Defined in: [phaser/models/GameModel.ts:7](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L7)

***

### players

> **players**: `Record`\<`string`, [`PlayerModel`](../../PlayerModel/classes/PlayerModel.md)\> = `{}`

Defined in: [phaser/models/GameModel.ts:11](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L11)

## Methods

### getPropertyOwner()

> **getPropertyOwner**(`propertyId`): `string` \| `null`

Defined in: [phaser/models/GameModel.ts:29](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/models/GameModel.ts#L29)

#### Parameters

##### propertyId

`string`

#### Returns

`string` \| `null`
