namespace SpriteKind {
    export const Cursor = SpriteKind.create()
}

let currentLoc: tiles.Location = null
let cursorLocation: number[] = []
let cursorSprite: Sprite = null
let currentLocationData: number[] = []
let aliveSprites: SparseArray<Sprite> = {}
function moveSprite(sprite: Sprite, fromLocation: tiles.Location, toLocation: tiles.Location) {
    currentLocationData[fromLocation.col + fromLocation.row * game.currentScene().tileMap.data.width] = null
    currentLocationData[toLocation.col + toLocation.row * game.currentScene().tileMap.data.width] = sprite.id
}
scene.setTileMapLevel(tilemap`default`)
for (let index = 0; index < 4; index++) {
    let enemySprite = character.createAndRandonlyPlaceSprite(img`
        . . . . . . f . . . f . . . . . 
        . . . . . f 4 f . f 4 f . . . . 
        . . . . f 4 5 4 f 4 5 4 f . . . 
        . . f f 4 4 4 5 4 5 4 4 4 f . . 
        . f 8 8 8 1 f 8 8 1 f 8 8 4 f . 
        . 8 8 6 8 1 1 8 8 1 1 8 8 8 f . 
        . f 6 6 4 4 4 5 f 5 4 4 4 4 f . 
        . . f 4 4 4 2 4 4 4 2 4 4 4 f . 
        . . . f 4 4 4 2 2 2 4 4 4 f . . 
        . 8 . . f 4 4 4 4 4 4 f . 8 . . 
        . 8 8 f 4 4 4 5 5 4 4 4 f 8 8 . 
        . . 8 4 4 4 5 5 5 5 4 4 4 4 8 . 
        . . . f 4 4 4 5 5 4 4 4 f f . . 
        . . . f 4 4 4 4 4 4 4 4 f . . . 
        . . . . f 4 4 f f 4 4 f . . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.Enemy, sprites.castle.tilePath5)
    let enemyHpBar = statusbars.create(16, 2, StatusBarKind.EnemyHealth)
    enemyHpBar.attachToSprite(enemySprite)
}
let playerSprite = character.createAndPlaceSprite(img`
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . 5 5 5 5 5 5 5 5 . . . . 
    . . . 5 5 5 5 5 5 5 5 5 5 . . . 
    . . 5 5 5 5 5 2 2 5 5 5 5 5 . . 
    . . 5 5 5 5 5 2 2 5 5 5 5 5 . . 
    . . 5 5 5 5 5 5 5 5 5 5 5 5 . . 
    . . 5 5 5 5 e e e e 5 5 5 5 . . 
    . 5 5 e 5 b f 4 4 f b 5 e 5 5 . 
    . 5 e e 8 1 f d d f 1 8 e e 5 . 
    . . f e e d d d d d d e e f . . 
    . . . f e e 8 8 8 8 e e f . . . 
    . . e 8 f 8 8 5 5 8 8 f 8 e . . 
    . . 8 d f 8 8 8 8 8 8 f d 8 . . 
    . . 8 8 f 8 8 5 5 8 8 f 8 8 . . 
    . . . . . f f f f f f . . . . . 
    . . . . . 8 8 . . 8 8 . . . . . 
    `, SpriteKind.Player, 1, 1)
cursorSprite = sprites.create(img`
    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    2 . . . . . . . . . . . . . . 2 
    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
    `, SpriteKind.Cursor)
cursorSprite.z = scene.HUD_Z
tiles.placeOnTile(cursorSprite, tiles.getTileLocation(0, 0))
scene.cameraFollowSprite(cursorSprite)
cursorLocation = [0, 0]
operation_context.applySelectionCursorMode()
