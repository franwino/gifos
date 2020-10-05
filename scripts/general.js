/* Modo Nocturno */
function modoNocturno() {
  const btn = document.getElementById("btnDarkMode");
  let darkMode = false;
  function setColor(vble, color) {
    document.documentElement.style.setProperty(vble, color);
  }
  const body = document.getElementsByTagName("body")[0];
  function toggleMode(mode) {
    let newMode;
    if (mode === false) {
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
  if (localStorage.getItem("dark") !== null) {
    darkMode = JSON.parse(localStorage.getItem("dark"));
  }
  darkMode = toggleMode(!darkMode);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    darkMode = toggleMode(darkMode);
    localStorage.setItem("dark", darkMode);
  });
}

/* Mostrar/Ocultar elementos del DOM por id */
function hide() {
  for (let arg of arguments) {
    const el = document.getElementById(arg);
    el.classList.add("hidden");
  }
}
function unhide() {
  for (let arg of arguments) {
    const el = document.getElementById(arg);
    el.classList.remove("hidden");
  }
}

/* Quitar clase active de todos los elementos */
function quitarActive() {
  const active = document.querySelectorAll(".active");
  for (let elem of active) {
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

/* buscar index de gif en array */
function searchById(id, array) {
  let index = -1;
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
}

/* Traer de localStorage por key*/
function getLocal(id) {
  let items = [];
  if (localStorage.getItem(id) !== null) {
    items = JSON.parse(localStorage.getItem(id));
  }
  return items;
}
/* Guardar array en localStorage */
function setLocal(id, array) {
  localStorage.setItem(id, JSON.stringify(array));
}

/* Descargar imagen */
async function download(url, title) {
  try {
    const gif = await fetch(url);
    const file = await gif.blob();
    invokeSaveAsDialog(file, title + ".gif");
  } catch (error) {
    console.log("error: " + error);
  }
}
