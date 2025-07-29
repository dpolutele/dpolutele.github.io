const canvas = document.getElementById('canvas-club');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const characters = '01';
const fontSize = 16;
let columns = canvas.width / fontSize;
let drops = Array.from({ length: Math.floor(columns) }, () => 1);

// Couleur dynamique du texte binaire
let rainColor = '#00f2ff'; // couleur par défaut (bleu matrix)

// Dessin boucle
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = rainColor;
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

// Toggle bouton : change la couleur du texte
const toggleBtn = document.querySelector('.toggle');

toggleBtn.addEventListener('click', () => {
    const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
    toggleBtn.setAttribute('aria-pressed', (!isPressed).toString());

    // Changer la couleur entre bleu et blanc
    rainColor = isPressed ? '#00f2ff' : '#00FF00';
});
