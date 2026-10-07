const socket = io();
console.log("funcions.js cargado");
let nom = "";
const missatges = document.getElementById("missatges");
const formNom = document.getElementById("formNom");
const inputNom = document.getElementById("name");
const zonaXat = document.getElementById("zonaXat");
const usuari = document.getElementById("usuari");
const formMissatge = document.getElementById("formMissatge");
const inputMissatge = document.getElementById("missatge");
// Al principio ocultamos el chat
zonaXat.hidden = true;


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

    // Ocultamos el formulario de entrada
    formNom.parentElement.hidden = true;
});


//funcio del missaget
formMissatge.addEventListener("submit",(e)=>{
    e.preventDefault();
    const text = inputMissatge.value.trim();
    if(text == ""){
        return;
    }

    socket.emit("chat:send",{
        nom: nom,
        text: text
    });
   
});

 socket.on("chat:message", (datos) =>{
        let div = document.createElement("div");
        div.classList.add("missatge");
        div.textContent = datos.nom + ": " + datos.text;
        missatges.appendChild(div);
        console.log("Mensaje: ", datos);
    });
