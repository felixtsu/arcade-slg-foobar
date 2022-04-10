// 在此处添加您的代码
namespace operation_context {

    export enum Operation {
        MOVE,
        ATTACK
    }

    let actingCharacter:Sprite = null
    let locationCandidates:tiles.Location[] = []
    let locationCandidateShaders: Sprite []= []

    let op:Operation 

    export function destroyCandidateShaders() {
        locationCandidateShaders.forEach(sprite => sprite.destroy())
        locationCandidateShaders = []
    }

    export function clearContext() {
        actingCharacter = null
        locationCandidates = []
        destroyCandidateShaders()
        op = null;
    }

    export function target(sprite:Sprite) {
        actingCharacter = sprite
    }

    export function addLocationCandidate(candidate:tiles.Location) {
        locationCandidates.push(candidate)
    }

    export function addLocationCandidatesShader(shader:Sprite) {
        locationCandidateShaders.push(shader)
    }

    export function validLocation(location:tiles.Location) {
        console.log(locationCandidates.length)
        console.log(location)
        return locationCandidates.find((candidate: tiles.Location) =>  candidate.col == location.col && candidate.row == location.row) != undefined
    }

    export function showMoveRange(sprite: Sprite, range: number = 3) {
        // 这个更像是攻击范围的计算方式；路径的应该通过递归完成；
        currentLoc = character.getSpriteLocation(sprite)
        // 当前不管怎么样先设定可以移动3格
        let minRow = Math.max(0, currentLoc.row - range)
        let maxRow = Math.min(game.currentScene().tileMap.data.height - 1, currentLoc.row + range)
        for (let i = minRow; i <= maxRow; i++) {
            let step = range - Math.abs(i - currentLoc.row)
            let minCol = Math.max(0, currentLoc.col - step)
            let maxCol = Math.min(game.currentScene().tileMap.data.width - 1, currentLoc.col + step)
            for (let j = minCol; j <= maxCol; j++) {
                if (character.getSpriteOnLoc(j, i) == null) {
                    let location = tiles.getTileLocation(j, i)
                    operation_context.addLocationCandidate(location)
                    let reachableTileMarker = shader.createRectangularShaderSprite(16, 16, shader.ShadeLevel.One)
                    tiles.placeOnTile(reachableTileMarker, location)
                    operation_context.addLocationCandidatesShader(reachableTileMarker)
                }
            }
        }
    }
    export function applySelectMoveDestinationMode() {
        cursor.cursorMovable()
        controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
            let cursorLocation2 =character.getSpriteLocation(cursorSprite)
            if (!operation_context.validLocation(cursorLocation2)) {
                return
            }

            story.startCutscene(() => {
                operation_context.destroyCandidateShaders()
                moveSprite(playerSprite,character.getSpriteLocation(playerSprite), tiles.locationOfSprite(cursorSprite))
                story.spriteMoveToLocation(playerSprite, cursorSprite.x, cursorSprite.y, 100)
                applySelectionCursorMode()
                story.cancelAllCutscenes()
            })
        })
    }
    

    export function applySelectAttackTargetMode() {
        cursor.cursorMovable()
        controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
            let sprite = cursor.getCursorSelectedSprite()
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
    export function applySelectionCursorMode() {
        cursor.cursorMovable()

        controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
            let sprite = cursor.getCursorSelectedSprite()
            if (sprite) {
                stopSelectionCursorMode()
                if (sprite.kind() == SpriteKind.Player) {
                    story.startCutscene(() => {
                        story.showPlayerChoices("移动", "攻击", "待命")
                        let choice = story.getLastAnswer()
                        if (choice == "移动") {
                            operation_context.clearContext()
                            operation_context.target(sprite)
                            operation_context.applySelectMoveDestinationMode()
                            operation_context.showMoveRange(playerSprite)
                            story.cancelAllCutscenes()
                        } else if (choice == "攻击") {
                            operation_context.clearContext()
                            operation_context.target(sprite)
                            applySelectAttackTargetMode()
                            character.showAttackRange(playerSprite)
                            story.cancelAllCutscenes()
                        } else if (choice == "待机") {

                        }
                    })
                }
            }
        })
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
}