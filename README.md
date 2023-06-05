# Challenge Legendaryum 🚀

## Tecnologías utilizadas 🛠️
- [Typescript](https://www.typescriptlang.org/)
- [NodeJs](https://nodejs.org/es)
- [Express.js](https://expressjs.com/es/)
- [Socket.io](https://socket.io/)
- [Redis](https://redis.io/)
- [ioredis](https://docs.redis.com/latest/rs/references/client_references/client_ioredis/)
- [uuid](https://www.npmjs.com/package/uuid)

## Funcionalidad del challenge 👨🏻‍💻
Una vez que el server está activo ( ```npm run dev``` para hacerlo de forma local ) se carga el archivo ```config.json```donde está la configuración de la base de datos. Se carga en Redis, y esta tiene la cantidad y nombre de habitaciones, cantidad de monedas que se van a generar y tamaños máximos del area de las habitaciones. 

Luego, teniendo en cuenta todas estas características se crean monedas en ubicaciones aleatorias, según las configuraciones anteriormente nombradas.

## Endpoints de la API 🎯
|HTTP|Endpoint|Descripción|
|--------|-----------|----|
|GET|localhost:4040/rooms|Ver todas las habitaciones disponibles|
|GET|localhost:4040/coins/room/:room|Pasandole el nombre de la room, se obtienen las monedas disponibles de la esta|

_Documentación en proceso..._