const apikey = "?api_key=KppHsCiWvApmVnuPSw2XE7mi3z6XR7s9";

/* Modo Nocturno */
function modoNocturno() {
  const btn = document.getElementById("btnDarkMode");
  let darkMode = false;
  function setColor(vble, color) {
    document.documentElement.style.setProperty(vble, color);
  }
  function toggleMode(mode) {
    if (mode == false) {
      setColor("--main-color", "#ffffff");
      setColor("--main-color-bg", "#000000");
      setColor("--main-color-2", "#ffffff");
      setColor("--bg-color", "#37383C");
      setColor("--bg-trending", "#222326");
      newMode = true;
    } else {
      setColor("--main-color", " #572ee5");
      setColor("--main-color-bg", "#572ee5");
      setColor("--main-color-2", "#000000");
      setColor("--bg-color", "#ffffff");
      setColor("--bg-trending", "#F3F5F8");
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
    if (!menu.classList.contains("open")) {
      burger.setAttribute("src", "assets/burger.svg");
    } else {
      burger.setAttribute("src", "assets/close.svg");
    }
  });
}
menuHamburguesa();

/* Search */
function search() {
  const input = document.getElementById("search");
  function autoComplete(query) {
    const url =
      "https://api.giphy.com/v1/gifs/search/tags" + apikey + "&q=" + query;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let n = Math.min(data.data.length, 4);
        const ul = document.getElementById("autocomplete");
        ul.innerHTML = "";
        for (let i = 0; i < n; i++) {
          const el = document.createElement("li");
          el.innerText = data.data[i].name;
          ul.appendChild(el);
        }
      })
      .catch((error) => console.log("error:", error));
  }
  input.addEventListener("input", (e) => {
    let query = input.value;
    autoComplete(query);
  });
  const btnBuscar = document.getElementById("buscar");
  btnBuscar.addEventListener("click", (e) => {
    doSearch();
  });
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
        document.getElementById("grilla-rdo").appendChild(cont);
      });
      const section = document.getElementsByClassName("busqueda");
      section[1].classList.toggle("hidden");
    }
  }
}
search();

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
