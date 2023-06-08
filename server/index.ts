import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import IORedis from "ioredis";
import { promisify } from "util";
import config from "./config/config.json";
import { generateCoins } from "./utils/generateRomsAndCoins.controller";
import coinsRoutes from "./routes/coins.routes";
import roomsRoutes from "./routes/rooms.routes";
import { getCoinsByRoom } from "./utils/getCoinsByRoomRedis";
import { deleteCoinById } from "./utils/deleteCoinById";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});
const PORT: number = 5000;

// Rutas de la API
app.use("/", coinsRoutes);
app.use("/", roomsRoutes);

io.on("connection", (socket: Socket) => {
    console.log("New user connected");

    socket.on("enterRoom", async (data: any) => {
        const { data: eventData } = data;
        const coinsJSON: string[] = await getCoinsByRoom(eventData.roomName);
        const { roomName } = eventData;
        const response = {
            status: "success",
            message: "Room entered successfully",
            event: roomName,
            coins: coinsJSON
        };
        socket.emit("enterRoom", response);
    });
    socket.on("deleteCoin", async (data: any) => {
        const { data: eventData } = data;
        const coinId: string = eventData.coinId;
        const roomName: string = eventData.roomName;
        await deleteCoinById(coinId, roomName);
        const response = {
            status: "success",
            message: `Coin ID ${coinId} deleted`
        };
        socket.emit("coinDeleted", response);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));
const client = new IORedis({
    host: "localhost",
    port: 6379
});

export const setAsync = promisify(client.set).bind(client);

async function saveConfigToRedis() {
    try {
        const configJSON = JSON.stringify(config);
        await setAsync("config", configJSON);
        console.log("Config saved successfully on Redis");
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function startServer() {
    await saveConfigToRedis();
    await generateCoins();
    client.quit();
}

startServer();
