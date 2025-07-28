var canvas = document.getElementById("canvas-club");
var ctx = canvas.getContext("2d");

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

var max = 70; // un peu plus de gouttes pour densité
var drops = [];

var isMobile = /Mobi|Android/i.test(navigator.userAgent);

var mouse = { x: null, y: null, radius: 120 };

window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function Drop() {
    this.x = random(0, w);
    this.y = random(-1000, 0);
    this.speed = random(2, 5);  // plus rapide
    this.value = Math.round(Math.random()); // 0 ou 1
    this.size = isMobile ? 14 : 18;
    this.alpha = random(0.5, 1);  // transparence variable
    this.flicker = Math.random() < 0.1; // 10% de chances de flicker (clignoter)
}

Drop.prototype.draw = function() {
    ctx.font = `${this.size}px monospace`;
    // couleur avec alpha et glow
    ctx.fillStyle = `hsla(180, 80%, 60%, ${this.alpha})`;
    ctx.shadowColor = 'hsl(180, 100%, 60%)';
    ctx.shadowBlur = 6;
    ctx.fillText(this.value, this.x, this.y);
    
    // contour sombre fin
    ctx.strokeStyle = `hsla(180, 100%, 20%, ${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.strokeText(this.value, this.x, this.y);
    
    // flicker aléatoire : on éclaire ou pas
    if(this.flicker && Math.random() < 0.3) {
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
            this.x += dx > 0 ? 5 : -5;  // décalage plus marqué pour effet “repousse”
            this.value = this.value === 0 ? 1 : 0;  // flip binaire au passage
            this.alpha = 1;  // plus visible quand près de la souris
        } else {
            // alpha revient doucement vers une valeur aléatoire normale
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

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // fond opaque plus sombre pour meilleur contraste
    ctx.fillRect(0, 0, w, h);
    drops.forEach(drop => {
        drop.draw();
        drop.update();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

setup();
animate();
