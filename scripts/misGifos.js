let misGifos;
let arrayMisGifos = [];
buscarCreados();

/* Buscar por la API los gifs creados en funcion de los ids */
async function buscarCreados() {
  try {
    arrayMisGifos = [];
    misGifos = getLocal("mis");
    if (misGifos.length > 0) {
      const stringCreados = misGifos.join();
      const url = `https://api.giphy.com/v1/gifs?api_key=${apikey}&ids=${stringCreados}`;
      const response = await fetch(url);
      const data = await response.json();
      for (const gif of data.data) {
        arrayMisGifos.push(gif);
      }
    }
  } catch (error) {
    console.log("error:", error);
  }
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
  for (let p of pasos) {
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
const gifListo = document.getElementById("gif-listo");

const contadorText = document.getElementById("contador");
const btnRepetir = document.getElementById("repetir");

let streamCam,
  recorder,
  form = new FormData();

let cronometro,
  hour = "00",
  min = "00",
  sec = "00";

/* Para resetear sin abandonar la pagina */
function crearGifo() {
  btnCrear.textContent = "COMENZAR";
  btnCrear.setAttribute("onclick", "comenzar()");
  hide(
    "video",
    "msj-2",
    "msj-crear-1",
    "msj-crear-2",
    "contador",
    "repetir",
    "gif-listo",
    "contenedor-gif-creado"
  );
  unhide("msj-1", "btnPasosCrear");
  pasoActivo(0);
}

/* Solicito permiso para utilizar la camara */
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
      unhide("contenedor-gif-creado", "video");
      hide("msj-2");
      video.srcObject = stream;
      video.play();
      btnCrear.innerText = "grabar";
      btnCrear.setAttribute("onclick", "grabar()");
      unhide(btnCrear.id);
      pasoActivo(2);
      recorder = RecordRTC(stream, {
        type: "gif",
        width: 360,
      });
    });
}

function comenzar() {
  pasoActivo(1);
  hide(btnCrear.id, "msj-1");
  unhide("msj-2");
  getStreamAndRecord();
}

function grabar() {
  btnCrear.setAttribute("onclick", "finalizar()");
  btnCrear.innerText = "finalizar";
  hide(btnRepetir.id);
  unhide(contadorText.id);
  recorder.startRecording();
  cronometro = setInterval(timer, 1000);
}

function finalizar() {
  clearInterval(cronometro);
  (hour = "00"), (min = "00"), (sec = "00");
  contadorText.innerText = "00:00:00";
  recorder.stopRecording(function () {
    form.set("file", recorder.getBlob(), "myGif.gif");
    form.set("api_key", apikey);
    unhide(gifListo.id);
    hide(video.id);
    gifListo.src = URL.createObjectURL(recorder.getBlob());
  });
  hide(contadorText.id);
  unhide(btnRepetir.id);
  btnCrear.innerText = "SUBIR GIFO";
  btnCrear.setAttribute("onclick", "subir()");
}

async function subir() {
  hide(btnRepetir.id, btnCrear.id);
  pasoActivo(3);
  unhide("msj-crear-1");
  const url = "https://upload.giphy.com/v1/gifs";
  try {
    const response = await fetch(url, { method: "POST", body: form });
    const data = await response.json();
    misGifos.push(data.data.id);
    setLocal("mis", misGifos);
    await buscarCreados();
    hide("msj-crear-1");
    unhide("msj-crear-2");
    const gifSubido = arrayMisGifos[arrayMisGifos.length - 1];
    console.log("gif: " + gifSubido);
    const btnLink = document.getElementById("link-mi-gifo");
    btnLink.setAttribute("onclick", `copiar("${gifSubido.url}")`);
    const btnDw = document.getElementById("descargar-mi-gifo");
    btnDw.setAttribute(
      "onclick",
      `download("${gifSubido.images.original.webp}", "${gifSubido.title}")`
    );
  } catch (error) {
    console.log("error:", error);
  }
}

function repetir() {
  hide(btnRepetir.id, gifListo.id);
  getStreamAndRecord();
}

function copiar(texto) {
  const el = document.createElement("textarea");
  el.value = texto;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  alert("El link a su GIFO se ha copiado al portapapeles!");
}

function timer() {
  sec++;

  if (sec < 10) sec = `0` + sec;

  if (sec > 59) {
    sec = `00`;
    min++;

    if (min < 10) min = `0` + min;
  }

  if (min > 59) {
    min = `00`;
    hour++;

    if (hour < 10) hour = `0` + hour;
  }

  contadorText.innerText = `${hour}:${min}:${sec}`;
}
