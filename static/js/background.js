const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dotColor = "22, 84, 141"; // #16548D

const SPACING = 40;
const RADIUS = 2.0;
const AMPLITUDE = 15;
const SPEED = 0.0008;
const WAVE_LENGTH = 0.01;

let cols, rows, dots;

function buildGrid() {
	cols = Math.ceil(canvas.width / SPACING) + 2;
	rows = Math.ceil(canvas.height / SPACING) + 2;
	dots = [];

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			dots.push({
				baseX: i * SPACING,
				baseY: j * SPACING,
				alpha: 0.20 + Math.random() * 0.14
			});
		}
	}
}

function animate(time) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (const dot of dots) {
		const wave =
			Math.sin(dot.baseX * WAVE_LENGTH + time * SPEED) * AMPLITUDE +
			Math.cos(dot.baseY * WAVE_LENGTH * 0.6 + time * SPEED * 0.8) * (AMPLITUDE * 0.4);

		const y = dot.baseY + wave;

		ctx.beginPath();
		ctx.arc(dot.baseX, y, RADIUS, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(${dotColor}, ${dot.alpha})`;
		ctx.fill();
	}

	requestAnimationFrame(animate);
}

buildGrid();
animate(0);

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	buildGrid();
});
