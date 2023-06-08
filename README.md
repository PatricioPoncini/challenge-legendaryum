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
Una vez que el server está activo ( ```npm run dev``` para hacerlo de forma local ) se carga el archivo ```config.json```donde está la configuración de la base de datos. Se carga en Redis, y esta tiene la cantidad y nombre de habitaciones, cantidad de monedas que se van a generar y tamaños máximos del area de las habitaciones. Como punto creativo, creé los nombres de las rooms basandome en palabras claves de la leyenda "Los Caballeros de la Mesa Redonda", ya que es algo que me pareció divertido, a la vez de darle un toque más original.

Luego, teniendo en cuenta todas estas características se crean monedas en ubicaciones aleatorias, según las configuraciones anteriormente nombradas.

La carga de las rooms y las coins se hace desde un JSON llamado ```config.json``` ya que se me hacía más fácil generarlas a las monedas junto con la room, nombres y demás datos a utilizar.

## Endpoints de la API 🎯
|HTTP|Endpoint|Descripción|
|--------|-----------|----|
|GET|localhost:4040/rooms|Ver todas las habitaciones disponibles|
|GET|localhost:4040/coins/room/:room|Pasandole el nombre de la room, se obtienen las monedas disponibles de la esta|

## Documentación de Postman
### REST API
[Documentación Postman de la REST API](https://documenter.getpostman.com/view/21179839/2s93saZYA1)

## Sockets
[Documentación Postman de los Sockets](https://grey-eclipse-965103.postman.co/workspace/My-Workspace~6b2a21ab-4ef0-4228-8a70-125caf6585d1/collection/6481347c6f2d226d949e0fa6)
