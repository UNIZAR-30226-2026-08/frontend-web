[**Documentación Técnica (Markdown)**](../../../../README.md)

***

[Documentación Técnica (Markdown)](../../../../modules.md) / [phaser/scenes/Board](../README.md) / Board

# Class: Board

Defined in: [phaser/scenes/Board.ts:29](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L29)

## Extends

- `Scene`

## Constructors

### Constructor

> **new Board**(): `Board`

Defined in: [phaser/scenes/Board.ts:48](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L48)

#### Returns

`Board`

#### Overrides

`Phaser.Scene.constructor`

## Properties

### animationManager

> **animationManager**: [`AnimationManager`](../../../managers/AnimationManager/classes/AnimationManager.md)

Defined in: [phaser/scenes/Board.ts:44](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L44)

***

### cameraController

> **cameraController**: [`CameraController`](../../../utils/CameraController/classes/CameraController.md)

Defined in: [phaser/scenes/Board.ts:38](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L38)

***

### diceManager

> **diceManager**: [`DiceManager`](../../../managers/DiceManager/classes/DiceManager.md)

Defined in: [phaser/scenes/Board.ts:34](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L34)

***

### selectedPlayer

> **selectedPlayer**: \{ `model`: [`PlayerModel`](../../../models/PlayerModel/classes/PlayerModel.md); `token`: [`PlayerToken`](../../../objects/PlayerToken/classes/PlayerToken.md); \} \| `null` = `null`

Defined in: [phaser/scenes/Board.ts:41](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L41)

***

### tileLogicManager

> **tileLogicManager**: [`TileLogicManager`](../../../managers/TileLogicManager/classes/TileLogicManager.md)

Defined in: [phaser/scenes/Board.ts:35](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L35)

## Methods

### announceTurn()

> **announceTurn**(`playerName`, `playerColor`): `Promise`\<`void`\>

Defined in: [phaser/scenes/Board.ts:299](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L299)

#### Parameters

##### playerName

`string`

##### playerColor

`string`

#### Returns

`Promise`\<`void`\>

***

### create()

> **create**(): `void`

Defined in: [phaser/scenes/Board.ts:78](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L78)

#### Returns

`void`

***

### createPlayer()

> **createPlayer**(`id`, `name`): `void`

Defined in: [phaser/scenes/Board.ts:251](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L251)

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void`

***

### getLocalPlayer()

> **getLocalPlayer**(): \{ `model`: [`PlayerModel`](../../../models/PlayerModel/classes/PlayerModel.md); `token`: [`PlayerToken`](../../../objects/PlayerToken/classes/PlayerToken.md); \} \| `null`

Defined in: [phaser/scenes/Board.ts:279](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L279)

#### Returns

\{ `model`: [`PlayerModel`](../../../models/PlayerModel/classes/PlayerModel.md); `token`: [`PlayerToken`](../../../objects/PlayerToken/classes/PlayerToken.md); \} \| `null`

***

### hideUI()

> **hideUI**(): `void`

Defined in: [phaser/scenes/Board.ts:241](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L241)

#### Returns

`void`

***

### init()

> **init**(`data`): `void`

Defined in: [phaser/scenes/Board.ts:52](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L52)

#### Parameters

##### data

###### myPlayerId?

`string`

#### Returns

`void`

***

### playSecretaryCutscene()

> **playSecretaryCutscene**(): `Promise`\<`void`\>

Defined in: [phaser/scenes/Board.ts:318](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L318)

#### Returns

`Promise`\<`void`\>

***

### preload()

> **preload**(): `void`

Defined in: [phaser/scenes/Board.ts:60](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L60)

#### Returns

`void`

***

### sendToSecretary()

> **sendToSecretary**(`playerId`): `Promise`\<`void`\>

Defined in: [phaser/scenes/Board.ts:391](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L391)

#### Parameters

##### playerId

`string`

#### Returns

`Promise`\<`void`\>

***

### showToast()

> **showToast**(`message`, `duration?`): `void`

Defined in: [phaser/scenes/Board.ts:314](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L314)

#### Parameters

##### message

`string`

##### duration?

`number`

#### Returns

`void`

***

### showUI()

> **showUI**(): `void`

Defined in: [phaser/scenes/Board.ts:246](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/scenes/Board.ts#L246)

#### Returns

`void`
