import * as alt from 'alt-server';
import { ReconnectHelper } from './utility/reconnect';


alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: alt.Player) {
    alt.log(`[${player.id}] ${player.name} has connected to the server.`);
    player.model = 'mp_m_freemode_01';
    player.spawn(36.19486618041992, 859.3850708007812, 197.71343994140625, 0);
    alt.emitClient(player, 'log:Console', 'alt:V Server - Boilerplate Started');
}

let staticData = []; 

const WIGHT: number = 500;
const HEIGHT: number = 1000;

/**
 * Функция заполняет поле квадратами;
 * @param player - не обязательный параметр (если будете создавать через команду)
 * @param coords1 - левая верхняя координата большого квадрата
 * @param coords2 - правая нижняя координата большого квадрата
 * @param wight - ширина одного внутреннего квадрата (по умолчанию 500 для наглядности)
 * @param height - высота одного внутреннего квадрата (по умолчанию 1000 для наглядности)
 */

function createSquares(player: alt.Player = null, coords1: any, coords2: any, wight: number = 500, height: number = 1000): void {
    let squaresLength = Number(Math.abs((coords1.x - coords2.x) / wight * (coords1.y - coords2.y) / wight).toFixed())
    let currentCoords = {...coords1};
    for (let index = squaresLength; index--;) {
    let coordsLeft = {x: currentCoords.x - wight / 2, y: currentCoords.y + wight /2 , z: currentCoords.z}
    let coordsRight = {x: currentCoords.x + wight /2, y: currentCoords.y - wight / 2, z: currentCoords.z}
    const colshape = new alt.ColshapeCuboid(coordsLeft.x, coordsLeft.y, coordsLeft.z - 200, coordsRight.x, coordsRight.y, height);
    colshape.setMeta(`colshape`, index)
    staticData.push({coords: {...currentCoords}, size: wight})
    if (currentCoords.x >= coords2.x) {
        currentCoords.x = coords1.x;
        currentCoords.y -= wight
    } else currentCoords.x += wight
    }
}

// Пример вызова функции

createSquares(null, {x: -4000.77949523925781, y: 9000.2919921875, z: -5.05659818649292},  {x: 4211.6865234375, y: -6558.10498046875, z: 0.42127108573913574}, WIGHT, HEIGHT) 

alt.on('entityEnterColshape', (colshape: alt.Colshape, entity: any) => {
       console.log(entity.name, `Вошел в зону ${colshape.getMeta('colshape')}`)
})

alt.on('entityLeaveColshape', (colshape: alt.Colshape, entity: any) => {
        console.log(entity.name, `Вышел из зоны ${colshape.getMeta('colshape')}`)
})

alt.on('playerConnect', (player: alt.Player) => {
    for (const colshape of staticData) {
        alt.emitClient(player, 'client::colsape:create', colshape.coords, colshape.size)
    }
})


ReconnectHelper.invoke();
