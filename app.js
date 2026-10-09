
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: false
    }
});

const port = 3000;

app.use(express.static('./public'));

io.on("connection", (socket) => {
    console.log("Cliente conectado con ID:", socket.id);

    socket.on("chat:send", (datos) => {
        console.log("Datos recibidos:", datos);

        if (socket.recovered) {
            console.log("Conexión recuperada");
        }else{
             console.log("Nueva Conexion establecida");
        }

        // 1. Comprobar que recibimos un objeto
        if (
            datos === null ||
            typeof datos !== "object" ||
            Array.isArray(datos)
        ) {
            console.log("Error: los datos no son un objeto válido");
            return;
        }

        // 2. Comprobar que las propiedades son cadenas
        if (
            typeof datos.nom !== "string" ||
            typeof datos.text !== "string"
        ) {
            console.log("Error: faltan nom o text");
            return;
        }

        // 3. Eliminar espacios al principio y al final
        const nom = datos.nom.trim();
        const text = datos.text.trim();

        // 4. Comprobar que no estén vacíos
        if (nom === "" || text === "") {
            console.log("Error: el nombre o el mensaje están vacíos");
            return;
        }

        // 5. Comprobar las longitudes
        if (nom.length > 20 || text.length > 500) {
            console.log("Error: se ha superado la longitud permitida");
            return;
        }

        // 6. Crear el mensaje validado
        const missatgeValidat = {
            nom: nom,
            text: text,
            hora: new Date().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit"
            })
        };

        // 7. Mostrar el mensaje en la terminal de Node
        console.log("Mensaje validado:", missatgeValidat);

        // 8. Enviar el mensaje a todos los clientes conectados
        io.emit("chat:message", missatgeValidat);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Escuchando en http://localhost:${port}`);
});