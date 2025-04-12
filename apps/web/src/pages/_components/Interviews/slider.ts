import "@splidejs/splide/css";
import Splide from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";

document.addEventListener("DOMContentLoaded", () => {
  new Splide(".splide-interviews", {
    type: "loop",
    drag: "free",
    focus: "center",
    autoWidth: true,
    pagination: false,
    arrows: true,
    perPage: 3,
    autoScroll: {
      speed: 1,
    },
    breakpoints: {
      550: {
        perPage: 1,
        pagination: true,
        arrows: true,
        autoScroll: false,
      },
      1024: {
        perPage: 2,
      },
    },
  }).mount({ AutoScroll });
});
