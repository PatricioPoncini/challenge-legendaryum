import IORedis from "ioredis";

const client = new IORedis({
    host: "localhost",
    port: 6379,
});
export const deleteCoinById = async (coinId: string, roomName: string) => {
    await client.hget(`room:${roomName}:coins`, coinId)
    const coinKey: string = `${coinId}`;
    const coinExists: number = await client.exists(coinKey);
    if (coinExists) {
        await client.hdel(`room:${roomName}:coins ${coinId}`, coinId);
    } else {
        console.log(`Coin ID ${coinId} not found`);
    }
}
