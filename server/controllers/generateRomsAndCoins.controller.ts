import { v4 as uuidv4 } from "uuid";
import CoinConfig from "../models/CoinConfig";
import CoinData from "../models/CoinData";
import IORedis from "ioredis";
import { promisify } from "util";
import config from "../config/config.json";

interface RoomConfig {
    coinCount: number;
    area: {
        xmin: number;
        xmax: number;
        ymin: number;
        ymax: number;
        zmin: number;
        zmax: number;
    };
}

interface Config {
    rooms: Record<string, RoomConfig>;
    coinTTL: number;
}

interface Area {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    zmin: number;
    zmax: number;
}

const client = new IORedis({
    connectTimeout: 5000
});

const setAsync = promisify(client.set).bind(client);

// Generar monedas por habitación
export async function generateCoins() {
    try {
        const rooms = (config as Config).rooms;
        const multi = client.multi();
        const coinTTL = (config as Config).coinTTL;
        let coinCount: number = 0;
        for (const roomName in rooms) {
            const room = rooms[roomName];
            coinCount = room.coinCount;
            const area = room.area;
            for (let i = 0; i < coinCount; i++) {
                const coinId = uuidv4();
                const position = generateRandomPosition(area);
                const coinConfig: CoinConfig = {
                    id: coinId,
                    room: roomName,
                    position: position,
                };
                const coinData: CoinData = {
                    id: coinId,
                    room: roomName,
                    position: position,
                };
                multi.set(`coin:${coinId}`, JSON.stringify(coinConfig));
                multi.expire(`coin:${coinId}`, coinTTL);
                multi.hset(`room:${roomName}:coins`, coinId, JSON.stringify(coinData));
                multi.ttl(`coin:${coinId}`);
                await setAsync(`coin:${coinId}`, JSON.stringify(coinConfig));
                await client.expire(`coin:${coinId}`, 60);
                await client.hset(`room:${roomName}:coins`, coinId, JSON.stringify(coinData));
            }
        }
        console.log("Coins generated successfully.");
    } catch (error) {
        console.log("Error generating coins: ", error);
    }
}

// Generar posiciones aleatorias en x, y, z utilizando parametros
function generateRandomPosition(area: Area) {
    const { xmin, xmax, ymin, ymax, zmin, zmax } = area;
    const x = Math.floor(Math.random() * (xmax - xmin + 1)) + xmin;
    const y = Math.floor(Math.random() * (ymax - ymin + 1)) + ymin;
    const z = Math.floor(Math.random() * (zmax - zmin + 1)) + zmin;
    return { x, y, z };
}