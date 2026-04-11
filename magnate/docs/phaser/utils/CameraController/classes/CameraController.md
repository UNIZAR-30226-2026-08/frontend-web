[**Documentación Técnica (Markdown)**](../../../../README.md)

***

[Documentación Técnica (Markdown)](../../../../modules.md) / [phaser/utils/CameraController](../README.md) / CameraController

# Class: CameraController

Defined in: [phaser/utils/CameraController.ts:5](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/utils/CameraController.ts#L5)

## Constructors

### Constructor

> **new CameraController**(`scene`): `CameraController`

Defined in: [phaser/utils/CameraController.ts:10](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/utils/CameraController.ts#L10)

#### Parameters

##### scene

`Scene`

#### Returns

`CameraController`

## Properties

### mainCam

> **mainCam**: `Camera`

Defined in: [phaser/utils/CameraController.ts:7](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/utils/CameraController.ts#L7)

## Methods

### focusOnTile()

> **focusOnTile**(`tile`, `zoom?`, `onComplete?`): `void`

Defined in: [phaser/utils/CameraController.ts:44](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/utils/CameraController.ts#L44)

#### Parameters

##### tile

[`Tile`](../../../objects/Tile/classes/Tile.md)

##### zoom?

`number` = `1`

##### onComplete?

() => `void`

#### Returns

`void`

***

### followToken()

> **followToken**(`token`, `zoom?`, `onArrived?`): `void`

Defined in: [phaser/utils/CameraController.ts:22](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/utils/CameraController.ts#L22)

#### Parameters

##### token

`any`

##### zoom?

`number` = `2.2`

##### onArrived?

() => `void`

#### Returns

`void`

***

### resetView()

> **resetView**(`duration?`): `void`

Defined in: [phaser/utils/CameraController.ts:56](https://github.com/UNIZAR-30226-2026-08/frontend-web/blob/4ccd63e9dab6dc1a3ff5e5af5c448079be8ac790/magnate/src/phaser/utils/CameraController.ts#L56)

#### Parameters

##### duration?

`number` = `1200`

#### Returns

`void`
