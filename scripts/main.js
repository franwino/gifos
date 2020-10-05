const apikey = "rj779YhmTNApuXDj0qRBcrr9Q2r6KPFU";
/* Ejecuta las funciones necesarias al cargar el sitio */
stickySearch();
modoNocturno();
autocomplete();
trendingSearchs();
let gifShown = 0;
let trendShow = 0;
trendingGifs();

/* Mostrar solo la seccion elegida */
function selSec(id) {
  hide("inicio", "seccion-busqueda", "sec-misGifos", "sec-favs", "sec-crear");
  unhide("sec-trending");
  if (id == "sec-crear") {
    hide("sec-trending");
  }
  unhide(id);
}

/* Menu scroll - Sombre y searchbar sticky */
function stickySearch() {
  const searchbar = document.getElementById("barra-busqueda");
  const sbHeight = searchbar.offsetHeight;
  let ypos = getPos(searchbar).y + 95 + sbHeight;
  const hero = document.querySelector(".img-hero");
  window.onscroll = function () {
    const navbar = document.getElementById("main-header");
    if (window.pageYOffset > 1) {
      navbar.classList.add("bot-shadow");
      if (window.pageYOffset > ypos && window.innerWidth > 1000) {
        searchbar.classList.add("sticky");
        hero.style.marginBottom = sbHeight + 31 + "px";
      } else {
        searchbar.classList.remove("sticky");
        hero.style.marginBottom = 0;
      }
    } else {
      navbar.classList.remove("bot-shadow");
    }
  };
}

/* Funcionamiento menu hamburguesa */
function menuHamburguesa() {
  if (window.innerWidth < 768) {
    const burger = document.getElementById("btn-burger");
    const menu = document.getElementById("menu");
    menu.classList.toggle("open");
    if (menu.classList.contains("open")) {
      burger.className = "fas fa-times";
    } else {
      burger.className = "fas fa-bars";
    }
  }
}

/* Botones del menu */
function menu(elem) {
  let op;
  switch (elem.id) {
    case "btnHome":
      op = "inicio";
      break;
    case "btnFav":
      op = "sec-favs";
      hide("ver-mas-fav");
      renderFavs();
      break;
    case "btnMis":
      op = "sec-misGifos";
      hide("ver-mas-misGifos");
      renderMisGifos();
      break;
    case "btnCrear":
      op = "sec-crear";
      crearGifo();
      break;
  }
  selSec(op);
  if (op !== "btnCrear" && streamCam !== undefined) {
    streamCam.getTracks().forEach((track) => track.stop());
  }
  makeActive(elem);
  const menu = document.getElementById("menu");
  if (menu.classList.contains("open")) {
    menuHamburguesa();
  }
  window.scrollTo(0, 0);
}

/* Mostrar favoritos */
function renderFavs() {
  gifShown = 0;
  const grillaFav = document.getElementById("rdo-favs");
  grillaFav.innerHTML = "";
  if (favs.length !== 0) {
    hide("fav-vacia");
    unhide("rdo-favs");
    masFavs();
  } else {
    hide("rdo-favs");
    unhide("fav-vacia");
  }
}
function masFavs() {
  const grillaFav = document.getElementById("rdo-favs");
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
  /* mostrar/ocultar boton de ver mas */
  const btn = document.getElementById("ver-mas-fav");
  if (gifShown >= favs.length) {
    btn.classList.add("hidden");
  } else {
    btn.classList.remove("hidden");
  }
}

let favs = getLocal("favs");
/* Agregar/quitar favs */
function fav(id, url_normal, user, title) {
  if (searchById(id, favs) === -1) {
    const datos = {
      id: id,
      images: {
        original: {
          webp: url_normal,
        },
      },
      username: user,
      title: title,
    };
    favs.push(datos);
    const gif = document.getElementById(id);
    const btn = gif.querySelector(".btn-fav");
    btn.classList.add("isFav");
    btn.src = "assets/icon-fav-active.svg";
  }
  setLocal("favs", favs);
  if (document.getElementById("btnFav").classList.contains("active")) {
    renderFavs();
  }
}
function borrarFav(id) {
  const index = searchById(id, favs);
  favs.splice(index, 1);
  setLocal("favs", favs);
  if (document.getElementById("btnFav").classList.contains("active")) {
    renderFavs();
  }
}

/* Maximizar GIF */
function toggleMax(id) {
  const elem = document.getElementById(id);
  elem.classList.remove("min");
  elem.classList.add("max");
  /* Muestro y habilito boton de cerrar */
  const close = elem.firstElementChild;
  close.classList.remove("hidden");
  close.addEventListener("click", (e) => {
    elem.classList.add("min");
    elem.classList.remove("max");
    close.classList.add("hidden");
  });
}

/* Renderizar un gif en un contenedor. Devuelve el HTML */
function renderGif(gif) {
  let user = gif.username;
  if (user === "") {
    user = "anonymous";
  }
  let titulo = gif.title;
  if (titulo === "") {
    titulo = "Sin título";
  }
  let card = "";
  card += `<div class="gif-container min" id="${gif.id}">
      <div class="close-max hidden"></div>
      <img class="gif" src="${gif.images.original.webp}" onclick='toggleMax("${gif.id}")' alt="${titulo}"/>
      <div class="card-hover">
        <div class="datos">
          <p class="user">${user}</p>
          <p class="gif-title">${titulo}</p>
        </div>
        <div class="card-btns">
          <img onclick='fav("${gif.id}","${gif.images.original.webp}","${user}","${titulo}")' class="btn-fav" src="assets/icon-fav-hover.svg" alt="Agregar a favoritos"/>
          <img onclick='download("${gif.images.original.webp}", "${titulo}")' class="btn-download" src="assets/icon-download-hover.svg" alt="Descargar GIF"/>
          <img onclick='toggleMax("${gif.id}")' class="btn-max" src="assets/icon-max-hover.svg" alt="Maximizar"/>
        </div>
      </div>
    </div>`;
  return card;
}

/* Renderizar una grilla de gifs a partir de un array */
function renderGrilla(data) {
  let grilla = "";
  for (let gif of data) {
    grilla += renderGif(gif);
  }
  return grilla;
}

/* Hacer la búsqueda y llamar a renderizarla */
async function doSearch(query) {
  try {
    const limit = 12;
    let offset = gifShown;
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${query}&limit=${limit}&offset=${offset}&rating=pg-13&lang=es`;
    const response = await fetch(url);
    const data = await response.json();
    unhide("seccion-busqueda");
    const header = document.getElementById("title-busq");
    header.textContent = query;
    const container = document.getElementById("rdo-busqueda");
    if (data.pagination.total_count !== 0) {
      const grilla = renderGrilla(data.data);
      hide("busqueda-vacia");
      unhide("rdo-busqueda");
      if (offset === 0) {
        container.innerHTML = grilla;
      } else {
        container.innerHTML += grilla;
      }
      const btn = document.getElementById("ver-mas-busqueda");
      gifShown += limit;
      if (gifShown > data.pagination.total_count) {
        btn.classList.add("hidden");
      } else {
        btn.classList.remove("hidden");
      }
    } else {
      hide("rdo-busqueda", "ver-mas-busqueda");
      unhide("busqueda-vacia");
    }
  } catch (error) {
    console.log("error:", error);
  }
}

/* Ver mas resultados de la busqueda */
function masSearch() {
  const query = document.getElementById("title-busq").textContent;
  doSearch(query);
}

/* Auto Completar y Buscar */
function autocomplete() {
  const input = document.getElementById("search");
  const btn = document.getElementById("buscarborrar");
  const lista = document.getElementById("autocomplete");
  const icono = document.getElementById("icono-lupa");
  function limpiarGrilla() {
    lista.innerHTML = "";
    icono.classList.add("invisible");
    btn.classList.add("fa-search");
    btn.classList.remove("fa-times");
    const div = document.getElementsByClassName("search-div");
    div[0].classList.add("invisible");
  }
  function newSearch(input) {
    gifShown = 0;
    doSearch(input.value);
    input.value = "";
    limpiarGrilla();
  }
  async function request(query) {
    try {
      const url =
        "https://api.giphy.com/v1/gifs/search/tags?api_key=" +
        apikey +
        "&q=" +
        query;
      const response = await fetch(url);
      const data = await response.json();
      let n = Math.min(data.data.length, 4);
      lista.innerHTML = "";
      for (let i = 0; i < n; i++) {
        const img = document.createElement("i");
        img.className = "lupa-aux fas fa-search";
        const el = document.createElement("p");
        el.innerText = data.data[i].name;
        const container = document.createElement("div");
        container.className = "autocomplete-field";
        container.appendChild(img);
        container.appendChild(el);
        container.addEventListener("click", (e) => {
          input.value = data.data[i].name;
          newSearch(input);
        });
        lista.appendChild(container);
      }
      if (query !== "") {
        icono.classList.remove("invisible");
        btn.classList.remove("fa-search");
        btn.classList.add("fa-times");
      } else {
        icono.classList.add("invisible");
        btn.classList.add("fa-search");
        btn.classList.remove("fa-times");
      }

      const div = document.getElementsByClassName("search-div");
      if (lista.childElementCount !== 0) {
        div[0].classList.remove("invisible");
      } else {
        div[0].classList.add("invisible");
      }
    } catch (error) {
      console.log("error:", error);
    }
  }

  icono.addEventListener("click", (e) => {
    newSearch(input);
  });
  btn.addEventListener("click", (e) => {
    input.value = "";
    limpiarGrilla();
  });
  input.addEventListener("input", (e) => {
    request(input.value);
  });
  input.addEventListener("keydown", (e) => {
    if (input.value !== "" && e.key == "Enter") {
      e.preventDefault();
      newSearch(input);
    }
  });
}

/* Buscar al hacer click en un tema trending */
function trendSearch(query) {
  gifShown = 0;
  doSearch(query);
}

/* Trending Searchs */
async function trendingSearchs() {
  const url = "https://api.giphy.com/v1/trending/searches?api_key=" + apikey;

  try {
    const response = await fetch(url);
    const data = await response.json();
    createElement(data);
  } catch (error) {
    console.log("error:", error);
  }

  function createElement(data) {
    const n = 5;
    rdo = "";
    for (let i = 0; i < n; i++) {
      rdo += `<span class="trend" onclick='trendSearch("${data.data[i]}")'> ${data.data[i]}</span>`;
      if (i < n - 1) {
        rdo += ", ";
      }
    }
    document.getElementById("text-trends").innerHTML = rdo;
  }
}

/* Trending GIFs */
async function trendingGifs() {
  try {
    const limit = 3;
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apikey}&limit=${limit}&offset=${trendShow}`;
    const response = await fetch(url);
    const data = await response.json();
    const grilla = renderGrilla(data.data);
    const container = document.getElementById("trending-gifs");
    container.innerHTML = grilla;
  } catch (error) {
    console.log("error:", error);
  }
}

/* Funcionalidad sliders de trending */
function trendSlider(offset) {
  if (trendShow + offset >= 0) {
    trendShow += offset;
    trendingGifs();
  }
}
