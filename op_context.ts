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
}