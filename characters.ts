// 在此处添加您的代码
namespace character {

    export function getSpriteLocation(sprite: Sprite) {
        return tiles.locationOfSprite(sprite)
    }
    export function getSpriteOnLoc(col: number, row: number) {
        let spriteId = currentLocationData[col + row * game.currentScene().tileMap.data.width]
        if (!(spriteId)) {
            return null
        } else {
            return aliveSprites[spriteId]
        }
    }

    export function showAttackRange(character: Sprite) {
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

    export function createAndPlaceSprite(spriteImage: Image, spriteKind: number, col: number, row: number) {
        let createdSprite = sprites.create(spriteImage, spriteKind)
        aliveSprites[createdSprite.id] = createdSprite
        createdSprite.onDestroyed(() => {
            aliveSprites[createdSprite.id] = null
        })
        tiles.placeOnTile(createdSprite, tiles.getTileLocation(col, row))
        currentLocationData[col + row * game.currentScene().tileMap.data.width] = createdSprite.id
        return createdSprite
    }
    export function createAndRandonlyPlaceSprite(spriteImage: Image, spriteKind: number, targetTile: Image) {
        let targetLocations = tiles.getTilesByType(targetTile)
        let targetLocation = targetLocations[randint(0, targetLocations.length - 1)]
        return createAndPlaceSprite(spriteImage, spriteKind, targetLocation.col, targetLocation.row)
    }
}