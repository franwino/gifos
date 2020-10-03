let misGifos;
let arrayMisGifos = buscarCreados();

/* Buscar por la API los gifs creados en funcion de los ids */
function buscarCreados() {
  let array = [];
  misGifos = getLocal("mis");
  const stringCreados = misGifos.join();
  const url = `https://api.giphy.com/v1/gifs?api_key=${apikey}&ids=${stringCreados}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (const gif of data.data) {
        array.push(gif);
      }
    });
  return array;
}

/* Mostrar mis GIFOS */
function renderMisGifos() {
  gifShown = 0;
  const grillaMis = document.getElementById("rdo-mis-gifos");
  grillaMis.innerHTML = "";
  if (arrayMisGifos.length !== 0) {
    hide("misGifos-vacia");
    unhide("rdo-mis-gifos");
    masGifos();
  } else {
    hide("rdo-mis-gifos");
    unhide("misGifos-vacia");
  }
}

function masGifos() {
  const grillaCreados = document.getElementById("rdo-mis-gifos");
  let n = Math.min(arrayMisGifos.length - gifShown, 12);
  for (let i = 0; i < n; i++) {
    grillaCreados.innerHTML += renderGif(arrayMisGifos[gifShown]);
    gifShown++;
  }
  const gifsCreados = grillaCreados.querySelectorAll(".gif-container");
  for (const gif of gifsCreados) {
    const btn = gif.querySelector(".btn-fav");
    btn.src = "assets/icon-trash-hover.svg";
    btn.setAttribute("onclick", `borrarCreado("${gif.id}")`);
  }
  /* mostrar/ocultar boton de ver mas */
  const btn = document.getElementById("ver-mas-misGifos");
  if (gifShown >= arrayMisGifos.length) {
    btn.classList.add("hidden");
  } else {
    btn.classList.remove("hidden");
  }
}

/* Quitar del listado de mis gifos */
function borrarCreado(id) {
  const index1 = searchById(id, misGifos);
  misGifos.splice(index1, 1);
  setLocal("mis", misGifos);
  const index2 = searchById(id, arrayMisGifos);
  arrayMisGifos.splice(index2, 1);
  if (document.getElementById("btnMis").classList.contains("active")) {
    renderMisGifos();
  }
}

function pasoActivo(paso) {
  const pasos = document.querySelectorAll(".paso-a-paso");
  for (p of pasos) {
    if (p.classList.contains("activo")) {
      p.classList.remove("activo");
      break;
    }
  }
  if (paso === 1 || paso === 2 || paso == 3) {
    document.querySelector("#paso" + paso).classList.add("activo");
  }
}

const btnCrear = document.getElementById("btnPasosCrear");
const video = document.getElementById("video");

const contador = document.getElementById("contador");
const btnRepetir = document.getElementById("repetir");

let streamCam;
let recorder;
let form = new FormData();

/* Para resetear sin abandonar la pagina */
function crearGifo() {
  btnCrear.textContent = "COMENZAR";
  btnCrear.setAttribute("onclick", "comenzar()");
  hide("video");
  hide("msj-2");
  hide("msj-crear-1");
  hide("msj-crear-2");
  hide("contador");
  hide("repetir");
  unhide("msj-1");
  unhide("btnPasosCrear");
  pasoActivo(0);
}

function getStreamAndRecord() {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        height: { max: 480 },
      },
    })
    .then(function (stream) {
      streamCam = stream;
      unhide("video");
      hide("msj-2");
      video.srcObject = stream;
      video.play();
      btnCrear.innerText = "grabar";
      btnCrear.setAttribute("onclick", "grabar()");
      unhide(btnCrear.id);
      pasoActivo(2);
      recorder = RecordRTC(stream, {
        type: "gif",
        /* width: 360, */
      });
    });
}

function comenzar() {
  pasoActivo(1);
  hide(btnCrear.id);
  hide("msj-1");
  unhide("msj-2");
  getStreamAndRecord();
}

function grabar() {
  btnCrear.setAttribute("onclick", "finalizar()");
  btnCrear.innerText = "finalizar";
  hide(btnRepetir.id);
  unhide(contador.id);
  recorder.startRecording();
  contador.innerText = "grabando";
}

function finalizar() {
  recorder.stopRecording(function () {
    form.set("file", recorder.getBlob(), "myGif.gif");
    form.set("api_key", apikey);
  });
  hide(contador.id);
  unhide(btnRepetir.id);
  btnCrear.innerText = "SUBIR GIFO";
  btnCrear.setAttribute("onclick", "subir()");
}

function subir() {
  hide(btnRepetir.id);
  hide(btnCrear.id);
  pasoActivo(3);
  unhide("msj-crear-1");
  const url = "https://upload.giphy.com/v1/gifs";
  console.log("SUBIENDO!");
  /* fetch(url, {
    method: "POST",
    body: form,
  })
    .then((response) => response.json())
    .then((data) => {
      misGifos.push(data.data.id);
      setLocal("mis", misGifos);
      arrayMisGifos = buscarCreados();
      hide("msj-crear-1");
      unhide("msj-crear-2");
    }); */
}

function repetir() {
  hide(btnRepetir.id);
  getStreamAndRecord();
}
