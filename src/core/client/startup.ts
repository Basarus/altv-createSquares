import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer('log:Console', handleLogConsole);

const player = alt.Player.local

function handleLogConsole(msg: string) {
    alt.log(msg);
}

alt.on('consoleCommand', (msg: string, args: any) => {
if (msg === 'coords'){
    alt.log(`{x: ${player.pos.x}, y: ${player.pos.y}, z: ${player.pos.z}}`)
}
})

let staticData = []

alt.onServer('client::colsape:create', (coords: any, size: number) => {
let blip = native.addBlipForArea(coords.x, coords.y, coords.z, size, size)
native.setBlipAlpha(blip, 50);
native.setBlipAsShortRange(blip, false);
native.setBlipRotation(blip, 0);
native.setBlipSquaredRotation(blip, 0);
native.setBlipSprite(blip, 2);
native.setBlipColour(blip, Math.floor(Math.random() * (10 - 0 + 1)) + 0);
staticData.push(blip)
})

alt.on('disconnect', () => {
    staticData.map(b => {
        native.removeBlip(b)
    })
})