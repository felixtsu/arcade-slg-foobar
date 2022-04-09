namespace SpriteKind {
    export const Cursor = SpriteKind.create()
}

let aliveSprites: SparseArray<Sprite> = {}
let currentLocationData: number[] = []

function getSpriteLocation(sprite:Sprite):tiles.Location {
    return tiles.locationOfSprite(sprite)
}

function moveSprite(sprite:Sprite, fromLocation:tiles.Location, toLocation:tiles.Location) {
    currentLocationData[fromLocation.col + fromLocation.row*game.currentScene().tileMap.data.width] = null
    currentLocationData[toLocation.col + toLocation.row * game.currentScene().tileMap.data.width] = sprite.id
}

function createAndRandonlyPlaceSprite(spriteImage: Image, spriteKind: number, targetTile:Image): Sprite {
    let targetLocations = tiles.getTilesByType(targetTile)
    let targetLocation = targetLocations[randint(0, targetLocations.length - 1)]
    return createAndPlaceSprite(spriteImage, spriteKind, targetLocation.col, targetLocation.row)
}

function createAndPlaceSprite(img:Image, spriteKind:number, col:number, row:number) :Sprite{
    let ret = sprites.create(img, spriteKind)
    aliveSprites[ret.id] = ret
    ret.onDestroyed(()=> {
        aliveSprites[ret.id] = null
    })

    tiles.placeOnTile(ret, tiles.getTileLocation(col, row))
    currentLocationData[col + row * game.currentScene().tileMap.data.width] = ret.id
    return ret
}

function getSpriteOnLoc(col :number, row:number) :Sprite{
    let spriteId = currentLocationData[col + row*game.currentScene().tileMap.data.width]
    if (!spriteId) {
        return null
    } else {
        return aliveSprites[spriteId]
    }
}

let enemySprite: Sprite = null
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
`, SpriteKind.Player,  1, 1)


let cursorSprite = sprites.create(img`
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
tiles.placeOnTile(cursorSprite, tiles.getTileLocation(0, 0))
scene.cameraFollowSprite(cursorSprite)

let cursorLocation = [0, 0]
function updateCursorLocation() {
    tiles.placeOnTile(cursorSprite, tiles.getTileLocation(cursorLocation[0], cursorLocation[1]))
}


let currentMoveDestinationShaders:Sprite[] = []

function destroyCurrentMoveDestinationShaders() {
    for (let shader of currentMoveDestinationShaders) {
        shader.destroy()
    }
}

function showMoveRange(character:Sprite) {
    let currentLoc = getSpriteLocation(character)
    let range = 3 // 当前不管怎么样先设定可以移动3格
    let minRow = Math.max(0, currentLoc.row - range)    
    let maxRow = Math.min(game.currentScene().tileMap.data.height - 1, currentLoc.row + range )
    for (let i = minRow; i <= maxRow; i++) {
        let step = range - Math.abs(i - currentLoc.row)
        let minCol = Math.max(0, currentLoc.col - step)
        let maxCol = Math.min(game.currentScene().tileMap.data.width - 1, currentLoc.col + step)
        for (let j = minCol; j <= maxCol; j++) {
            if (getSpriteOnLoc(j, i) == null) {
                let reachableTileMarker = shader.createRectangularShaderSprite(16, 16, shader.ShadeLevel.One)
                tiles.placeOnTile(reachableTileMarker, tiles.getTileLocation(j, i))
                currentMoveDestinationShaders.push(reachableTileMarker)
            }            
        }
    }

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
// 设置当前的操作模式为光标选择单位模式
function applySelectionCursorMode() {
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
    controller.A.onEvent(ControllerButtonEvent.Pressed, ()=> {
        stopSelectionCursorMode()
        let sprite = getSpriteOnLoc(cursorLocation[0], cursorLocation[1])
        if (sprite) {
            if (sprite.kind() == SpriteKind.Player) {
                story.startCutscene( () => {
                    story.showPlayerChoices("移动", "攻击", "待命")
                    let choice = story.getLastAnswer()
                    if(choice == "移动") {
                        applySelectMoveDestinationMode()
                        showMoveRange(playerSprite)
                        story.cancelAllCutscenes()
                    }
                })
            }   
        }
    })
}

function applySelectMoveDestinationMode() {
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
    controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
        if (illegalLDestination()) {
            return
        }

        story.startCutscene(() => {
            destroyCurrentMoveDestinationShaders()
            moveSprite(playerSprite, getSpriteLocation(playerSprite), tiles.locationOfSprite(cursorSprite))
            story.spriteMoveToLocation(playerSprite, cursorSprite.x, cursorSprite.y, 50)
            applySelectionCursorMode()
            story.cancelAllCutscenes()
        }) 
    })
}

function illegalLDestination() {
    
}


applySelectionCursorMode()