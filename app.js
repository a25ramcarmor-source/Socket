const express = require('express');
const http = require('http'); // 1. Módulo HTTP nativo de Node
const { Server } = require('socket.io'); // 2. Importamos la clase Server

const app = express();
const server = http.createServer(app); // 3. Creamos el servidor HTTP envolviendo Express
const io = new Server(server); // 4. Inicializamos Socket.IO adjuntándolo al servidor

const port = 3000;

app.use(express.static('./public'));

// 5. Ahora io sí es la instancia y funciona io.on
io.on("connection", (socket) => {
    console.log("Client connectat amb ID:", socket.id);
    
    socket.on("chat:send",(datos) =>{
        console.log(datos);
        io.emit("caht:message", datos);
    });

    
});

// 6. IMPORTANTE: Hay que arrancar server.listen(), NO app.listen()
server.listen(port, () => {
    console.log(`Escoltant a http://localhost:${port}`);
});