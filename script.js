// Floating 3D elements
const floats = document.querySelectorAll('.float');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  floats.forEach((el, i) => {
    const speed = (i + 1) * 0.6; // faster reaction
    const rotateMultiplier = (i + 1) * 1.5;
    el.style.transform = `translateY(${scrollY * speed}px) rotateY(${scrollY * rotateMultiplier}deg) rotateX(${scrollY * rotateMultiplier/2}deg)`;
  });
});

// Optional: react to mouse movement for more interactive feel
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX - window.innerWidth / 2) / 50;
  const y = (e.clientY - window.innerHeight / 2) / 50;
  floats.forEach((el, i) => {
    el.style.transform += ` translateX(${x*(i+1)}px) translateY(${y*(i+1)}px)`;
  });
});