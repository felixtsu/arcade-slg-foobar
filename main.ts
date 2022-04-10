namespace SpriteKind {
    export const Cursor = SpriteKind.create()
}
function showMoveRange(character: Sprite, range: number = 3) {
    // 这个更像是攻击范围的计算方式；路径的应该通过递归完成；
    currentLoc = getSpriteLocation(character)
    // 当前不管怎么样先设定可以移动3格
    let minRow = Math.max(0, currentLoc.row - range)
    let maxRow = Math.min(game.currentScene().tileMap.data.height - 1, currentLoc.row + range)
    for (let i = minRow; i <= maxRow; i++) {
        let step = range - Math.abs(i - currentLoc.row)
        let minCol = Math.max(0, currentLoc.col - step)
        let maxCol = Math.min(game.currentScene().tileMap.data.width - 1, currentLoc.col + step)
        for (let j = minCol; j <= maxCol; j++) {
            if (getSpriteOnLoc(j, i) == null) {
                let location = tiles.getTileLocation(j, i)
                operation_context.addLocationCandidate(location)
                let reachableTileMarker = shader.createRectangularShaderSprite(16, 16, shader.ShadeLevel.One)
                tiles.placeOnTile(reachableTileMarker, location)
                operation_context.addLocationCandidatesShader(reachableTileMarker)
            }
        }
    }
}
function applySelectMoveDestinationMode() {
    cursorMovable()
    controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
        let cursorLocation2 = getSpriteLocation(cursorSprite)
        if (!operation_context.validLocation(cursorLocation2)) {
            return
        }

        story.startCutscene(() => {
            operation_context.destroyCandidateShaders()
            moveSprite(playerSprite, getSpriteLocation(playerSprite), tiles.locationOfSprite(cursorSprite))
            story.spriteMoveToLocation(playerSprite, cursorSprite.x, cursorSprite.y, 100)
            applySelectionCursorMode()
            story.cancelAllCutscenes()
        })
    })
}
function getSpriteLocation(sprite: Sprite) {
    return tiles.locationOfSprite(sprite)
}
function getSpriteOnLoc(col: number, row: number) {
    let spriteId = currentLocationData[col + row * game.currentScene().tileMap.data.width]
    if (!(spriteId)) {
        return null
    } else {
        return aliveSprites[spriteId]
    }
}
function cursorMovable() {
    controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
        if (cursorLocation[1] > 1) {
            cursorLocation[1] -= 1
        }
        updateCursorLocation()
    })
    controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
        if (cursorLocation[1] < game.currentScene().tileMap.data.height - 1) {
            cursorLocation[1] += 1
        }
        updateCursorLocation()
    })
    controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
        if (cursorLocation[0] > 0) {
            cursorLocation[0] -= 1
        }
        updateCursorLocation()
    })
    controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
        if (cursorLocation[0] < game.currentScene().tileMap.data.width - 1) {
            cursorLocation[0] += 1
        }
        updateCursorLocation()
    })
}
function showAttackRange(character: Sprite) {
    currentLoc = getSpriteLocation(character)
    let range = 2
    let minRow = Math.max(0, currentLoc.row - range)
    let maxRow = Math.min(game.currentScene().tileMap.data.height - 1, currentLoc.row + range)
    for (let i = minRow; i <= maxRow; i++) {
        let step = range - Math.abs(i - currentLoc.row)
        let minCol = Math.max(0, currentLoc.col - step)
        let maxCol = Math.min(game.currentScene().tileMap.data.width - 1, currentLoc.col + step)
        for (let j = minCol; j <= maxCol; j++) {
            let location = tiles.getTileLocation(j, i)
            operation_context.addLocationCandidate(location)
            let reachableTileMarker = shader.createRectangularShaderSprite(16, 16, shader.ShadeLevel.One)
            tiles.placeOnTile(reachableTileMarker, location)
            operation_context.addLocationCandidatesShader(reachableTileMarker)
        }
    }

}
function getCursorSelectedSprite() :Sprite {
    return getSpriteOnLoc(cursorLocation[0], cursorLocation[1])
}

function applySelectAttackTargetMode() {
    cursorMovable()
    controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
        let sprite = getCursorSelectedSprite()
        if (sprite) {
            stopSelectionCursorMode()
            if (sprite.kind() == SpriteKind.Enemy) {
                let attackPower = 10
                let defense = 5
                
                let enemyHpBar = statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, sprite)
                enemyHpBar.value -= attackPower - defense

                operation_context.destroyCandidateShaders()
                applySelectionCursorMode()
            }

        }
    })
}
// 设置当前的操作模式为光标选择单位模式
function applySelectionCursorMode() {
    cursorMovable()

    controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
        let sprite = getCursorSelectedSprite()
        if (sprite) {
            stopSelectionCursorMode()
            if (sprite.kind() == SpriteKind.Player) {
                story.startCutscene(() => {
                    story.showPlayerChoices("移动", "攻击", "待命")
                    let choice = story.getLastAnswer()
                    if (choice == "移动") {
                        operation_context.clearContext()
                        operation_context.target(sprite)
                        applySelectMoveDestinationMode()
                        showMoveRange(playerSprite)
                        story.cancelAllCutscenes()
                    } else if (choice == "攻击") {
                        operation_context.clearContext()
                        operation_context.target(sprite)
                        applySelectAttackTargetMode()
                        showAttackRange(playerSprite)
                        story.cancelAllCutscenes()
                    } else if (choice == "待机") {

                    }
                })
            }
        }
    })
}
function updateCursorLocation() {
    tiles.placeOnTile(cursorSprite, tiles.getTileLocation(cursorLocation[0], cursorLocation[1]))
}
function stopSelectionCursorMode() {
    controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
    })
    controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
    })
    controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
    })
    controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
    })
    controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    })
}
function createAndPlaceSprite(spriteImage: Image, spriteKind: number, col: number, row: number) {
    let createdSprite = sprites.create(spriteImage, spriteKind)
    aliveSprites[createdSprite.id] = createdSprite
    createdSprite.onDestroyed(() => {
        aliveSprites[createdSprite.id] = null
    })
    tiles.placeOnTile(createdSprite, tiles.getTileLocation(col, row))
    currentLocationData[col + row * game.currentScene().tileMap.data.width] = createdSprite.id
    return createdSprite
}
function createAndRandonlyPlaceSprite(spriteImage: Image, spriteKind: number, targetTile: Image) {
    targetLocations = tiles.getTilesByType(targetTile)
    targetLocation = targetLocations[randint(0, targetLocations.length - 1)]
    return createAndPlaceSprite(spriteImage, spriteKind, targetLocation.col, targetLocation.row)
}
let targetLocation: tiles.Location = null
let targetLocations: tiles.Location[] = []
let currentLoc: tiles.Location = null
let cursorLocation: number[] = []
let cursorSprite: Sprite = null
let enemySprite: Sprite = null
let currentLocationData: number[] = []
let aliveSprites: SparseArray<Sprite> = {}
function moveSprite(sprite: Sprite, fromLocation: tiles.Location, toLocation: tiles.Location) {
    currentLocationData[fromLocation.col + fromLocation.row * game.currentScene().tileMap.data.width] = null
    currentLocationData[toLocation.col + toLocation.row * game.currentScene().tileMap.data.width] = sprite.id
}
scene.setTileMapLevel(tilemap`default`)
for (let index = 0; index < 4; index++) {
    enemySprite = createAndRandonlyPlaceSprite(img`
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
let playerSprite = createAndPlaceSprite(img`
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
applySelectionCursorMode()
