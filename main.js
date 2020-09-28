const apikey = "?api_key=KppHsCiWvApmVnuPSw2XE7mi3z6XR7s9";

/* Mostrar/Ocultar elementos del DOM por id */
function hide(id) {
  const el = document.getElementById(id);
  el.classList.add("hidden");
}
function unhide(id) {
  const el = document.getElementById(id);
  el.classList.remove("hidden");
}

/* Obtener coordenadas de un elemento */
function getPos(el) {
  var xPos = 0;
  var yPos = 0;

  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += el.offsetLeft - xScroll + el.clientLeft;
      yPos += el.offsetTop - yScroll + el.clientTop;
    } else {
      // for all other non-BODY elements
      xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPos += el.offsetTop - el.scrollTop + el.clientTop;
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos,
  };
}

/* Quitar clase active de todos los elementos */
function quitarActive() {
  const active = document.querySelectorAll(".active");
  for (elem of active) {
    if (elem.classList.contains("active")) {
      elem.classList.remove("active");
      break;
    }
  }
}

/* Hacer active solo un elemento */
function makeActive(elem) {
  quitarActive();
  elem.classList.add("active");
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
stickySearch();

/* Funcionamiento menu hamburguesa */
function menuHamburguesa() {
  if (window.innerWidth < 768) {
    const burger = document.getElementById("btn-burger");
    menu.classList.toggle("open");
    if (menu.classList.contains("open")) {
      burger.className = "fas fa-times";
    } else {
      burger.className = "fas fa-bars";
    }
  }
}

/* Modo Nocturno */
function modoNocturno() {
  const btn = document.getElementById("btnDarkMode");
  let darkMode = false;
  function setColor(vble, color) {
    document.documentElement.style.setProperty(vble, color);
  }
  const body = document.getElementsByTagName("body")[0];
  function toggleMode(mode) {
    if (mode == false) {
      setColor("--main-color", "#ffffff");
      setColor("--main-color-bg", "#000000");
      setColor("--main-color-2", "#ffffff");
      setColor("--bg-color", "#37383C");
      setColor("--bg-trending", "#222326");
      btn.textContent = "Modo Diurno";
      body.classList.add("dark");
      newMode = true;
    } else {
      setColor("--main-color", "#572ee5");
      setColor("--main-color-bg", "#572ee5");
      setColor("--main-color-2", "#000000");
      setColor("--bg-color", "#ffffff");
      setColor("--bg-trending", "#F3F5F8");
      btn.textContent = "Modo Nocturno";
      body.classList.remove("dark");
      newMode = false;
    }
    return newMode;
  }
  if (localStorage.getItem("dark") != null) {
    darkMode = JSON.parse(localStorage.getItem("dark"));
  }
  darkMode = toggleMode(!darkMode);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    darkMode = toggleMode(darkMode);
    localStorage.setItem("dark", darkMode);
  });
}
modoNocturno();

/* Botón Home */
function home() {
  const btn = document.getElementById("btnHome");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    unhide("inicio");
    hide("seccion-busqueda");
    hide("sec-misGifos");
    hide("sec-favs");
    hide("sec-crear");
    quitarActive();
    if (menu.classList.contains("open")) {
      menuHamburguesa();
    }
    window.scrollTo(0, 0);
  });
}
home();

/* Favoritos */
function favoritos() {
  const btn = document.getElementById("btnFav");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    hide("inicio");
    hide("seccion-busqueda");
    hide("sec-misGifos");
    hide("sec-crear");
    unhide("sec-favs");
    menuHamburguesa();
    makeActive(btn);
    window.scrollTo(0, 0);
  });
}
favoritos();

/* Mis Gifos */
function misGifos() {
  const btn = document.getElementById("btnMis");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    hide("inicio");
    hide("seccion-busqueda");
    hide("sec-favs");
    hide("sec-crear");
    unhide("sec-misGifos");
    menuHamburguesa();
    makeActive(btn);
    window.scrollTo(0, 0);
  });
}
misGifos();

/* Crear nuevos Gifos */
function crearGifos() {
  const btn = document.getElementById("btnCrear");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    hide("inicio");
    hide("seccion-busqueda");
    hide("sec-favs");
    hide("sec-misGifos");
    unhide("sec-crear");
    menuHamburguesa();
    makeActive(btn);
    window.scrollTo(0, 0);
  });
}
crearGifos();

/* Auto Completar */
function autocomplete() {
  const lista = document.getElementById("autocomplete");
  const btn = document.getElementById("buscarborrar");
  function request(query) {
    const url =
      "https://api.giphy.com/v1/gifs/search/tags" + apikey + "&q=" + query;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let n = Math.min(data.data.length, 4);
        lista.innerHTML = "";
        for (let i = 0; i < n; i++) {
          const img = document.createElement("i");
          img.className = "lupa-aux far fa-search";
          const el = document.createElement("p");
          el.innerText = data.data[i].name;
          const container = document.createElement("div");
          container.className = "autocomplete-field";
          container.appendChild(img);
          container.appendChild(el);
          el.addEventListener("click", (e) => {
            input.value = data.data[i].name;
            doSearch();
            input.value = "";
            request(input.value);
          });
          lista.appendChild(container);
        }
        const icono = document.getElementById("icono-lupa");
        if (query != "") {
          icono.classList.remove("invisible");
          btn.classList.remove("fa-search");
          btn.classList.add("fa-times");
        } else {
          icono.classList.add("invisible");
          btn.classList.add("fa-search");
          btn.classList.remove("fa-times");
        }
        const div = document.getElementsByClassName("search-div");
        if (lista.childElementCount != 0) {
          div[0].classList.remove("invisible");
        } else {
          div[0].classList.add("invisible");
        }
      })
      .catch((error) => console.log("error:", error));
  }
  const input = document.getElementById("search");
  btn.addEventListener("click", (e) => {
    input.value = "";
    request(input.value);
  });
  input.addEventListener("input", (e) => {
    request(input.value);
  });
  input.addEventListener("keydown", (e) => {
    if (input.value !== "" && e.key == "Enter") {
      e.preventDefault();
      doSearch();
      input.value = "";
      request(input.value);
    }
    if (input.value !== "" && e.key == "ArrowDown") {
    }
  });
}
autocomplete();

function fav(id) {
  console.log(id);
}

function download(id) {
  console.log(id);
}

/* Maximizar GIF */
function toggleMax(id) {
  const elem = document.getElementById(id);
  elem.classList.remove("min");
  elem.classList.add("max");
  const close = elem.firstElementChild;
  /* Muestro y habilito boton de cerrar */
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
      <i class="close-max fas fa-times hidden"></i>
      <img class="gif" src="${gif.images.downsized.url}" onclick=toggleMax("${gif.id}") alt="${titulo}"/>
      <div class="card-hover">
        <div class="datos">
          <p class="user">${user}</p>
          <p class="gif-title">${titulo}</p>
        </div>
        <div class="card-btns">
          <img onclick=fav("${gif.id}") class="btn-fav" src="assets/icon-fav-hover.svg" alt="Agregar a favoritos"/>
          <img onclick=download("${gif.id}") class="btn-download" src="assets/icon-download-hover.svg" alt="Descargar GIF"/>
          <img onclick=toggleMax("${gif.id}") class="btn-max" src="assets/icon-max-hover.svg" alt="Maximizar"/>
        </div>
      </div>
    </div>`;
  return card;
}

/* Renderizar una grilla de gifs a partir de una busqueda */
function renderGrilla(data) {
  let grilla = "";
  data.data.forEach((gif) => {
    grilla += renderGif(gif);
  });
  return grilla;
}

/* Hacer la búsqueda y llamar a renderizarla */
function doSearch() {
  let offset = 0;
  const query = document.getElementById("search").value;
  const limit = 12;
  const url = `https://api.giphy.com/v1/gifs/search${apikey}&q=${query}&limit=${limit}&offset=${offset}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      unhide("seccion-busqueda");
      const header = document.getElementById("title-busq");
      header.textContent = query;
      const container = document.getElementById("rdo-busqueda");
      if (data.pagination.total_count !== 0) {
        const grilla = renderGrilla(data);
        container.innerHTML = grilla;
        hide("busqueda-vacia");
        unhide("rdo-busqueda");
      } else {
        hide("rdo-busqueda");
        unhide("busqueda-vacia");
      }
      const gotoSearch = document.getElementById("goto-search");
      gotoSearch.scrollIntoView();
    })
    .catch((error) => console.log("error:", error));
}

/* Trending Searchs */
function trendingSearchs() {
  const url = "https://api.giphy.com/v1/trending/searches" + apikey;

  fetch(url)
    .then((response) => response.json())
    .then((data) => createElement(data))
    .catch((error) => console.log("error:", error));

  function createElement(data) {
    const n = 5;
    rdo = "";
    for (let i = 0; i < n; i++) {
      rdo += data.data[i];
      if (i < n - 1) {
        rdo += ", ";
      }
    }
    document.getElementById("text-trends").innerText = rdo;
  }
}
trendingSearchs();

/* Trending GIFs */
function trendingGifs() {
  const limit = 3;
  let offset = 0;
  const url = `https://api.giphy.com/v1/gifs/trending${apikey}&limit=${limit}&offset=${offset}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const grilla = renderGrilla(data);
      const container = document.getElementById("trending-gifs");
      container.innerHTML = grilla;
    })
    .catch((error) => console.log("error:", error));
}
trendingGifs();
