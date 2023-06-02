import express from "express";
import http from "http";
import redis, { ClientOpts, RedisClient } from 'redis';
import { Server as SocketIOServer, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
const PORT = 4040;
const redisOptions: ClientOpts = {
    host: 'localhost',
    port: 6379,
};

const client: ClientOpts = redis.createClient(redisOptions);

io.on("connection", (socket: Socket) => {
    socket.on("joinRoom", (key: string) => {
        socket.join(key);
    });

    // cuando se agarra la moneda, se avisa a todos que ya no está disponible esa
    socket.on("grabCoin", (coin: Coin) => {
        socket.nsp.to(coin.key).emit("grabCoin", coin)
    })
});

type Coin = {
    key: string;
}

server.listen(PORT, () => console.log("Server listening on port " + PORT));
