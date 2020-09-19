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

/* Modo Nocturno */
function modoNocturno() {
  const btn = document.getElementById("btnDarkMode");
  let darkMode = false;
  function setColor(vble, color) {
    document.documentElement.style.setProperty(vble, color);
  }
  const icons = document.getElementsByClassName("icon");

  function toggleMode(mode) {
    if (mode == false) {
      setColor("--main-color", "#ffffff");
      setColor("--main-color-bg", "#000000");
      setColor("--main-color-2", "#ffffff");
      setColor("--bg-color", "#37383C");
      setColor("--bg-trending", "#222326");
      btn.innerText = "Modo Diurno";
      menu.classList.add("dark");
      for (const icon of icons) {
        icon.classList.add("dark");
      }
      newMode = true;
    } else {
      setColor("--main-color", " #572ee5");
      setColor("--main-color-bg", "#572ee5");
      setColor("--main-color-2", "#000000");
      setColor("--bg-color", "#ffffff");
      setColor("--bg-trending", "#F3F5F8");
      btn.innerText = "Modo Nocturno";
      menu.classList.remove("dark");
      for (const icon of icons) {
        icon.classList.remove("dark");
      }
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

/* Favoritos */
function favoritos() {
  const btn = document.getElementById("btnFav");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  });
}
favoritos();

/* Mis Gifos */
function misGifos() {
  const btn = document.getElementById("btnMis");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  });
}
misGifos();

/* Funcionamiento menu hamburguesa */
function menuHamburguesa() {
  const burger = document.getElementById("btn-burger");
  burger.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.toggle("open");
    if (menu.classList.contains("open")) {
      burger.className = "fas fa-times";
    } else {
      burger.className = "fas fa-bars";
    }
  });
}
menuHamburguesa();

/* Renderizar una grilla a partir de busqueda de gif */
function renderGifs(data) {
  let grilla = "";
  data.data.forEach((gif) => {
    let card = "";
    card += `<div class="gif-container">
      <img class="gif" src="${gif.images.downsized.url}" alt="${gif.title}"/>
      <div class="card-hover">
        <div class="datos">
          <p class="user">${gif.username}</p>
          <p class="gif-title">${gif.title}</p>
        </div>
        <div class="card-btns">
          <img src="assets/icon-fav-hover.svg" alt="Agregar a favoritos"/>
          <img src="assets/icon-download-hover.svg" alt="Descargar GIF"/>
          <img src="assets/icon-max-hover.svg" alt="Maximizar"/>
        </div>
      </div>
    </div>`;
    grilla += card;
  });
  return grilla;
}

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

/* Hacer la búsqueda y renderizarla */
function doSearch() {
  const offset = 0;
  const query = document.getElementById("search").value;
  const limit = 12;
  const url =
    "https://api.giphy.com/v1/gifs/search" +
    apikey +
    "&q=" +
    query +
    "&limit=" +
    limit +
    "&offset=" +
    offset;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      unhide("seccion-busqueda");
      const grilla = renderGifs(data);
      const container = document.getElementById("rdo-busqueda");
      container.innerHTML = grilla;
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
  const url = "https://api.giphy.com/v1/gifs/trending" + apikey + "&limit=3";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const grilla = renderGifs(data);
      const container = document.getElementById("trending-gifs");
      container.innerHTML = grilla;
    })
    .catch((error) => console.log("error:", error));
}
trendingGifs();
