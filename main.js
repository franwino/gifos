/* Funcionamiento menu hamburguesa */
const burger = document.getElementById("btn-burger");
burger.addEventListener("click", (e) => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("open");
  if (!menu.classList.contains("open")) {
    burger.setAttribute("src", "assets/burger.svg");
  }
  else {
    burger.setAttribute("src", "assets/close.svg");
  }
});


/* Request trending GIFs */
const url =
  "http://api.giphy.com/v1/gifs/trending?api_key=KppHsCiWvApmVnuPSw2XE7mi3z6XR7s9&limit=10";

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
    cont.className = "gif-container"
    cont.appendChild(el);
    document.getElementById("trending_gifs").appendChild(cont);
  });
}
