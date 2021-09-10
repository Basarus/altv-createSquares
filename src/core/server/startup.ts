import * as alt from 'alt-server';
import { ReconnectHelper } from './utility/reconnect';


alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: alt.Player) {
    alt.log(`[${player.id}] ${player.name} has connected to the server.`);
    player.model = 'mp_m_freemode_01';
    player.spawn(36.19486618041992, 859.3850708007812, 197.71343994140625, 0);
    alt.emitClient(player, 'log:Console', 'alt:V Server - Boilerplate Started');
}

// Код

interface IColsape{
    colshape: alt.Colshape
    coords: alt.Vector3;
    wight: number
}

let staticData: Array<IColsape> = []; 

/**
 * Функция заполняет поле квадратами;
 * @param player - не обязательный параметр (если будете создавать через команду)
 * @param coords1 - левая верхняя координата большого квадрата
 * @param coords2 - правая нижняя координата большого квадрата
 * @param wight - ширина одного внутреннего квадрата (по умолчанию 500 для наглядности)
 * @param height - высота одного внутреннего квадрата (по умолчанию 1000 для наглядности)
 */

function createSquares(coords1: alt.Vector3, coords2: alt.Vector3, wight: number = 500, height: number = 1000): void {
    
    let square = findSquare(coords1, coords2, wight)
    
    let currentCoords : any = {...coords1}; 

    for (let index = square; index--;) {

    let [left, right] = findAngles(currentCoords, wight)

    const colshape = new alt.ColshapeCuboid(left.x, left.y, left.z - 200, right.x, right.y, height);
    colshape.setMeta(`colshape`, index)

    staticData.push({colshape, coords: {...currentCoords}, wight})

    if (currentCoords.x >= coords2.x) {
        currentCoords.x = coords1.x;
        currentCoords.y -= wight
    } else currentCoords.x += wight

    }
}

function findAngles(coords: alt.Vector3, wight: number)  {
      let coords1 = {x: coords.x - wight / 2, y: coords.y + wight / 2 , z: coords.z};
      let coords2 = {x: coords.x + wight / 2, y: coords.y - wight / 2, z: coords.z};
      return [coords1, coords2]
}

function findSquare (coords1: alt.Vector3, coords2: alt.Vector3, wight: number) : number {
    let width = (coords1.x - coords2.x) / wight;
    let height = (coords1.y - coords2.y) / wight;
    let square = Math.floor(Math.abs(width * height))
    return square
}

// Пример вызова функции

const WIGHT: number = 500;
const HEIGHT: number = 1000;
const coords1 : any =  {x: -4000.77949523925781, y: 9000.2919921875, z: -5.05659818649292}
const coords2 : any =  {x: 4211.6865234375, y: -6558.10498046875,  z: 0.42127108573913574}

createSquares(coords1, coords2, WIGHT, HEIGHT) 

// Пример вызова функции


alt.on('entityEnterColshape', (colshape: alt.Colshape, player: alt.Player) => {
      console.log(player.name, `Вошел в зону ${colshape.getMeta('colshape')}`)
})

alt.on('entityLeaveColshape', (colshape: alt.Colshape, player: alt.Player) => {
      console.log(player.name, `Вышел из зоны ${colshape.getMeta('colshape')}`)
})

alt.on('playerConnect', (player: alt.Player) => {
    staticData.forEach(colshape => alt.emitClient(player, 'client::colsape:create', colshape.coords, colshape.wight))
})

// Код


ReconnectHelper.invoke();
