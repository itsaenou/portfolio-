const trackers = document.querySelectorAll(".tracker");
const svg = document.querySelector("#connections");

// Crear las líneas
function createLine() {
  const line = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  line.setAttribute("stroke", "rgba(255,255,255,0.65)");
  line.setAttribute("stroke-width", "1");

  svg.appendChild(line);

  return line;
}

const lines = [
  createLine(),
  createLine(),
  createLine()
];

// Hacer que las líneas sigan a los cuadrados
function updateLines() {

  const positions = [];

  trackers.forEach((tracker) => {

    const rect = tracker.getBoundingClientRect();

    positions.push({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });

  });

  lines.forEach((line, i) => {

    line.setAttribute("x1", positions[i].x);
    line.setAttribute("y1", positions[i].y);

    line.setAttribute("x2", positions[i + 1].x);
    line.setAttribute("y2", positions[i + 1].y);

  });

  requestAnimationFrame(updateLines);
}

updateLines();


// APARICIÓN
gsap.from(".tracker", {
  opacity: 0,
  scale: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: "power3.out"
});


// MOVIMIENTOS
gsap.to(".tracker-1", {
  x: 180,
  y: -80,
  duration: 6,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

gsap.to(".tracker-2", {
  x: -130,
  y: 120,
  duration: 7,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

gsap.to(".tracker-3", {
  x: 100,
  y: -120,
  duration: 8,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

gsap.to(".tracker-4", {
  x: -160,
  y: -100,
  duration: 9,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});


// NÚMEROS CAMBIANTES
setInterval(() => {

  trackers.forEach((tracker) => {

    const number = tracker.querySelector("span");

    number.textContent =
      (Math.random() * 1.2 + 0.2).toFixed(4);

  });

}, 180);