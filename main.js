const burger = document.getElementById("btn-burger");
burger.addEventListener("click", e => {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
})