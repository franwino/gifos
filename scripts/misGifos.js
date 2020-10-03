let misGifos = getLocal("mis");

/* Guardar mis Gifos en localStorage */
/* setLocal("mis", misGifos) */

/* Mostrar mis GIFOS */
function renderMisGifos() {
  gifShown = 0;
  const grillaMis = document.getElementById("rdo-mis-gifos");
  grillaMis.innerHTML = "";
  if (misGifos.length !== 0) {
    hide("misGifos-vacia");
    unhide("rdo-mis-gifos");
    /* masGifos(); */
  } else {
    hide("rdo-mis-gifos");
    unhide("misGifos-vacia");
  }
}
function masGifos() {
  /* const grillaFav = document.getElementById("rdo-favs");
  let n = Math.min(favs.length - gifShown, 12);
  for (let i = 0; i < n; i++) {
    grillaFav.innerHTML += renderGif(favs[gifShown]);
    gifShown++;
  }
  const favGifs = grillaFav.querySelectorAll(".gif-container");
  for (const gif of favGifs) {
    const btn = gif.querySelector(".btn-fav");
    btn.classList.add("isFav");
    btn.src = "assets/icon-fav-active.svg";
    btn.setAttribute("onclick", `borrarFav("${gif.id}")`);
  }
  const btn = document.getElementById("ver-mas-fav");
  if (gifShown >= favs.length) {
    btn.classList.add("hidden");
  } else {
    btn.classList.remove("hidden");
  } */
}

/* Quitar del listado de mis gifos */
function borrarMiGifos(id) {
  const index = searchById(id, misGifos);
  misGifos.splice(index, 1);
  setLocal("mis", misGifos);
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
  document.querySelector("#paso" + paso).classList.add("activo");
}

const btnCrear = document.getElementById("btnPasosCrear");
const video = document.getElementById("video");

const contador = document.getElementById("contador");
const repetir = document.getElementById("repetir");

let recorder;
let blob;
let form = new FormData();

function comenzar() {
  pasoActivo(1);
  hide(btnCrear.id);
  hide("msj-1");
  unhide("msj-2");
  getStreamAndRecord();
  function getStreamAndRecord() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          height: { max: 480 },
        },
      })
      .then(function (stream) {
        unhide("video");
        hide("msj-2");
        video.srcObject = stream;
        video.play();
        btnCrear.innerText = "grabar";
        btnCrear.removeAttribute("onclick");
        btnCrear.addEventListener("click", grabar);
        unhide(btnCrear.id);
        pasoActivo(2);
        recorder = RecordRTC(stream, {
          type: "gif",
          frameRate: 1,
          quality: 10,
          width: 360,
          hidden: 240,
          onGifRecordingStarted: function () {
            console.log("started");
          },
        });
      });
  }
}

function grabar() {
  recorder.startRecording();
  btnCrear.innerText = "FINALIZAR";
  btnCrear.removeEventListener("click", grabar);
  btnCrear.addEventListener("click", finalizar);
  hide(repetir.id);
  unhide(contador.id);
  contador.innerText = "grabando";
}

function finalizar() {
  recorder.stopRecording(function () {
    form.append("file", recorder.getBlob(), "myGif.gif");
    form.append("api_key", apikey);
    form.append("username", "Fran W");
  });
  hide(contador.id);
  unhide(repetir.id);
  btnCrear.innerText = "SUBIR GIFO";
  btnCrear.removeEventListener("click", finalizar);
  btnCrear.addEventListener("click", subir);
  console.log(form.entries());
}

function subir() {
  const url = "https://upload.giphy.com/v1/gifs";
  fetch(url, {
    method: "POST",
    body: form,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("subiendo");
      misGifos.push(data.data.id);
      console.log("subido exitosamente");
      hide(repetir.id);
      hide(btnCrear.id);
    });
}
