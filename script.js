var canvas = document.getElementById("canvas-club");
var ctx = canvas.getContext("2d");

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

var isMobile = /Mobi|Android/i.test(navigator.userAgent);

var max = isMobile ? 25 : 80;  // un peu moins que 110 pour fluidité PC
var drops = [];

var mouse = { x: null, y: null, radius: isMobile ? 70 : 120 };

if (!isMobile) {
  window.addEventListener('mousemove', function(e) {
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
    this.speed = isMobile ? random(2, 3) : random(4, 5); // un peu moins rapide PC
    this.value = Math.round(Math.random());
    this.size = isMobile ? 14 : 28;
    this.alpha = random(0.5, 1);
    this.flicker = false; // on gère globalement
}

Drop.prototype.draw = function() {
    ctx.font = `${this.size}px monospace`;
    ctx.fillStyle = `hsla(180, 80%, 60%, ${this.alpha})`;

    if (!isMobile) {
      ctx.shadowColor = 'hsl(180, 100%, 60%)';
      ctx.shadowBlur = 4;  // réduit blur néon
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fillText(this.value, this.x, this.y);

    ctx.strokeStyle = `hsla(180, 100%, 20%, ${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.strokeText(this.value, this.x, this.y);

    if(this.flicker) {
        ctx.fillStyle = `hsla(180, 100%, 80%, ${this.alpha})`;
        ctx.fillText(this.value, this.x, this.y);
    }
};

Drop.prototype.update = function() {
    this.y += this.speed;

    if (mouse.x && mouse.y) {
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;
        var dist = Math.sqrt(dx*dx + dy*dy);

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

var lastTime = 0;
var fpsInterval = isMobile ? 1000 / 30 : 1000 / 50; // 50 FPS PC pour plus de marge

// Flicker global, toggle toutes les 100ms environ
var flickerToggle = false;
setInterval(() => {
  flickerToggle = !flickerToggle;
  drops.forEach(drop => drop.flicker = flickerToggle && Math.random() < 0.1);
}, 100);

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

setup();
animate();
