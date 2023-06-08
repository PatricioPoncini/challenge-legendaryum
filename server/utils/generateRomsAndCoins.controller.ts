import { v4 as uuidv4 } from "uuid";
import CoinConfig from "../models/CoinConfig";
import CoinData from "../models/CoinData";
import IORedis from "ioredis";
import config from "../config/config.json";
import { setAsync } from "..";

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
    host: "localhost",
    port: 6379
});

export async function generateCoins() {
    try {
        const rooms = (config as Config).rooms;
        const multi = client.multi();
        const coinTTL: number = (config as Config).coinTTL;
        let coinCount: number = 0;
        for (const roomName in rooms) {
            const room = rooms[roomName];
            let coinCount: number = room.coinCount;
            const area: Area = room.area;
            for (let i = 0; i < coinCount; i++) {
                const coinId: string = uuidv4();
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

function generateRandomPosition(area: Area) {
    const { xmin, xmax, ymin, ymax, zmin, zmax } = area;
    const x = Math.floor(Math.random() * (xmax - xmin + 1)) + xmin;
    const y = Math.floor(Math.random() * (ymax - ymin + 1)) + ymin;
    const z = Math.floor(Math.random() * (zmax - zmin + 1)) + zmin;
    return { x, y, z };
}