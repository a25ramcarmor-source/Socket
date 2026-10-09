const socket = io({
    reconnectionDelay: 10000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0
});
console.log("funcions.js cargado");
let nom = "";
const missatges = document.getElementById("missatges");
const formNom = document.getElementById("formNom");
const inputNom = document.getElementById("name");
const zonaXat = document.getElementById("zonaXat");
const usuari = document.getElementById("usuari");
const formMissatge = document.getElementById("formMissatge");
const inputMissatge = document.getElementById("missatge");
const estat = document.getElementById("estat");
const botoEnviar = formMissatge.querySelector('button[type="submit"]');
// Al principio ocultamos el chat
zonaXat.hidden = true;

// Cuando Socket.IO se conecta
socket.on("connect", () => {
if (socket.recovered) {
        estat.textContent = "Connectat — estat recuperat";
        console.log("socket.recovered:", socket.recovered);
        console.log("S'ha recuperat l'estat de la connexió.");
    } else {
        estat.textContent = "Connectat — sessió nova o estat no recuperat";
        console.log("socket.recovered:", socket.recovered);
        console.log("Sessió nova o no s'ha pogut recuperar l'estat.");
    }

    // Solo permitir enviar si ya se ha introducido el nombre
    botoEnviar.disabled = nom === "";
});

// Cuando Socket.IO se desconecta
socket.on("disconnect", () => {
    estat.textContent = "Desconnectat";
    botoEnviar.disabled = true;

    // No borramos inputMissatge.value:
    // el texto escrito se conserva.
});


// Cuando se envía el formulario para entrar
formNom.addEventListener("submit", (e) => {

    // Evita que la página se recargue
    e.preventDefault();

    // Cogemos el nombre y eliminamos espacios
    nom = inputNom.value.trim();

    // Comprobamos que no esté vacío
    if (nom === "") {
        alert("El nom no pot estar buit");
        return;
    }

    // Comprobamos la longitud
    if (nom.length > 20) {
        alert("El nom no pot tenir més de 20 caràcters");
        return;
    }

    // Mostramos el nombre en el chat
    usuari.textContent = nom;

    // Mostramos la zona del chat
    zonaXat.hidden = false;
    botoEnviar.disabled = !socket.connected;

    // Ocultamos el formulario de entrada
    formNom.parentElement.hidden = true;
});


//funcio del missaget
formMissatge.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = inputMissatge.value.trim();
    if (text == "") {
        return;
    }

    if (!socket.connected) {
        estat.textContent = "Desconnectat";
        botoEnviar.disabled = true;
        return;
    }

    socket.emit("chat:send", {
        nom: nom,
        text: text
    });

});

socket.on("chat:message", (datos) => {

    // Crear el contenedor del mensaje
    const div = document.createElement("div");
    div.classList.add("missatge");

    //Direccio del missat
    if(datos.nom == nom){
        div.classList.add("missatge_enviat");
    }else{
        div.classList.add("misatge_rebut");
    }

    // Crear la cabecera con el nombre y la hora
    const capcalera = document.createElement("div");

    const nomMissatge = document.createElement("strong");
    nomMissatge.textContent = datos.nom;

    const horaMissatge = document.createElement("small");
    horaMissatge.textContent = " " + datos.hora;

    capcalera.appendChild(nomMissatge);
    capcalera.appendChild(horaMissatge);

    // Crear el texto del mensaje
    const contingut = document.createElement("p");
    contingut.textContent = datos.text;

    // Montar el mensaje completo
    div.appendChild(capcalera);
    div.appendChild(contingut);

    // Añadirlo a la conversación
    missatges.appendChild(div);

    // Bajar automáticamente al último mensaje
    missatges.scrollTop = missatges.scrollHeight;
});