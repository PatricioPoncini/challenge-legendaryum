import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
// import redis from "redis";
import IORedis from "ioredis";
import { promisify } from "util";
import config from "./config/config.json";
import { generateCoins } from "./controllers/generateRomsAndCoins";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
const PORT = 4040;

io.on("connection", () => {
    console.log("New user connected");
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));

// Cliente de Redis
const client = new IORedis({
    host: "localhost",
    port: 6379
});

// Convertit los métodos de callback a promesas
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Guardar configuración en Redis
async function saveConfigToRedis() {
    try {
        const configJSON = JSON.stringify(config);
        await setAsync("config", configJSON);
        console.log("Config saved successfully on Redis");
    } catch (error) {
        console.log("Error: ", error);
    } finally {
        // Cerrar la conexión del cliente
        client.quit();
    }
}
saveConfigToRedis();
generateCoins();

