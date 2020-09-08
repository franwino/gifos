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
