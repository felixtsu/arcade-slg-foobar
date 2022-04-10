namespace cursor {

    export function getCursorSelectedSprite(): Sprite {
        return character.getSpriteOnLoc(cursorLocation[0], cursorLocation[1])
    }
    export function updateCursorLocation() {
        tiles.placeOnTile(cursorSprite, tiles.getTileLocation(cursorLocation[0], cursorLocation[1]))
    }

    export function cursorMovable() {
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
}