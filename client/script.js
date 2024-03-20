document.addEventListener("DOMContentLoaded", function() {
    const nav = document.querySelector(".navbar");

    if (nav) {
        window.addEventListener("scroll", () => {
            console.log("Scrolling!");
            if (window.scrollY > 120) {
                nav.style.top = '0';
            } else {
                nav.style.top = '-80px';
            }
        });
    }
});
