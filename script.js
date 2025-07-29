const canvas = document.getElementById("canvas-club");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const max = isMobile ? 35 : 100;
const drops = [];

const mouse = { x: null, y: null, radius: isMobile ? 70 : 120 };

// Deux thèmes : même paramètres, seule la couleur change
const themes = [
    {
        name: "bleu",
        textColor: (a) => `hsla(180, 80%, 60%, ${a})`,
        strokeColor: (a) => `hsla(180, 100%, 20%, ${a})`,
        glowColor: 'hsl(180, 100%, 60%)',
        neon: true
    },
    {
        name: "noir",
        textColor: (a) => `rgba(200, 200, 200, ${a})`,
        strokeColor: (a) => `rgba(100, 100, 100, ${a})`,
        glowColor: null,
        neon: false
    }
];
let currentTheme = 0;

if (!isMobile) {
    window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function Drop() {
    this.x = random(0, w);
    this.y = random(-1000, 0);
    this.speed = isMobile ? random(3, 4) : random(6, 7);
    this.value = Math.round(Math.random());
    this.size = isMobile ? 14 : 28;
    this.alpha = random(0.5, 1);
    this.flicker = Math.random() < 0.1;
}

Drop.prototype.draw = function () {
    const theme = themes[currentTheme];
    ctx.font = `${this.size}px monospace`;
    ctx.fillStyle = theme.textColor(this.alpha);

    if (theme.neon && !isMobile) {
        ctx.shadowColor = theme.glowColor;
        ctx.shadowBlur = 6;
    } else {
        ctx.shadowBlur = 0;
    }

    ctx.fillText(this.value, this.x, this.y);
    ctx.strokeStyle = theme.strokeColor(this.alpha);
    ctx.lineWidth = 1;
    ctx.strokeText(this.value, this.x, this.y);

    if (this.flicker && Math.random() < 0.3 && theme.neon) {
        ctx.fillStyle = theme.textColor(1.0);
        ctx.fillText(this.value, this.x, this.y);
    }
};

Drop.prototype.update = function () {
    this.y += this.speed;

    if (mouse.x && mouse.y) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
            this.x += dx > 0 ? 5 : -5;
            this.value = this.value === 0 ? 1 : 0;
            this.alpha = 1;
        } else {
            this.alpha += (random(0.5, 1) - this.alpha) * 0.05;
        }
    }

    if (this.y > h) {
        this.y = random(-100, 0);
        this.x = random(0, w);
        this.value = Math.round(Math.random());
        this.alpha = random(0.5, 1);
    }

    if (this.x < 0) this.x = w;
    if (this.x > w) this.x = 0;
};

function setup() {
    for (let i = 0; i < max; i++) {
        drops.push(new Drop());
    }
}

let lastTime = 0;
const fpsInterval = isMobile ? 1000 / 30 : 1000 / 60;

function animate(time = 0) {
    if (time - lastTime > fpsInterval) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, w, h);

        drops.forEach(drop => {
            drop.draw();
            drop.update();
        });

        lastTime = time;
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

// Gestion du bouton toggle thème
const toggle = document.querySelector('.toggle');

toggle.addEventListener('click', () => {
  // Inverse l'état aria-pressed
  const isLight = toggle.getAttribute('aria-pressed') === 'true';
  toggle.setAttribute('aria-pressed', !isLight);

  // Change le thème en fonction du toggle
  currentTheme = !isLight ? 1 : 0; // 1 = noir, 0 = bleu (adapter si besoin)
});

setup();
animate();
