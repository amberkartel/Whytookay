// Simple parallax scroll for floating 3D elements
document.addEventListener("scroll", () => {
  let scrollY = window.scrollY;
  document.querySelectorAll(".floating").forEach((el, index) => {
    el.style.transform = `translateY(${scrollY * 0.1 * (index + 1)}px)`;
  });
});
