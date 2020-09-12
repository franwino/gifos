const apikey = "?api_key=KppHsCiWvApmVnuPSw2XE7mi3z6XR7s9";

/* Modo Nocturno */
function modoNocturno() {
  const btn = document.getElementById("btnDarkMode");
  function setColor(vble, color) {
    document.documentElement.style.setProperty(vble, color);
  }
  let darkMode = false;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (darkMode === false) {
      setColor("--main-color", "#ffffff");
      setColor("--main-color-bg", "#000000");
      setColor("--main-color-2", "#ffffff");
      setColor("--bg-color", "#37383C");
      setColor("--bg-trending", "#222326");
      darkMode = true;
    } else {
      setColor("--main-color", " #572ee5");
      setColor("--main-color-bg", "#572ee5");
      setColor("--main-color-2", "#000000");
      setColor("--bg-color", "#ffffff");
      setColor("--bg-trending", "#F3F5F8");
      darkMode = false;
    }
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
    const menu = document.getElementById("menu");
    e.preventDefault();
    menu.classList.toggle("open");
    if (!menu.classList.contains("open")) {
      burger.setAttribute("src", "assets/burger.svg");
    } else {
      burger.setAttribute("src", "assets/close.svg");
    }
  });
}
menuHamburguesa();

/* Request trending GIFs */
function trendingGifs() {
  const url = "http://api.giphy.com/v1/gifs/trending" + apikey + "&limit=3";

  fetch(url)
    .then((response) => response.json())
    .then((data) => createElement(data))
    .catch((error) => console.log("error:", error));

  function createElement(data) {
    data.data.forEach((gif) => {
      const el = document.createElement("img");
      el.src = gif.images.downsized.url;
      el.style.width = "243px";
      el.style.height = "187px";
      el.alt = gif.images.title;
      const cont = document.createElement("div");
      cont.className = "gif-container";
      cont.appendChild(el);
      document.getElementById("trending_gifs").appendChild(cont);
    });
  }
}
trendingGifs();

/* Trending Searchs */
function trendingSearchs() {
  const url = "http://api.giphy.com/v1/trending/searches" + apikey;

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
