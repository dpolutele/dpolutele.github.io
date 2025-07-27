var c = document.getElementById("canvas-club");
var ctx = c.getContext("2d");
var w = c.width = 1200;
var h = c.height = 900;
var clearColor = 'rgba(0, 0, 0, .1)';
var max = 30;
var drops = [];

// Détection mobile
var isMobile = /Mobi|Android/i.test(navigator.userAgent);

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function O() {}

O.prototype = {
    init: function() {
        this.x = random(0, w);
        this.y = 0;
        this.color = 'hsl(180, 100%, 50%)';
        this.w = 2;
        this.h = 1;
        // Vitesse ralentie sur mobile
        this.vy = isMobile ? random(1.5, 2.5) : random(4, 5);
        this.vw = 3;
        this.vh = 1;
        // Taille ajustée selon l'appareil
        this.size = isMobile ? 1.2 : 2;
        this.hit = random(h * .8, h * .9);
        this.a = 1;
        this.va = .96;
    },
    draw: function() {
        if (this.y > this.hit) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.h / 2);

            ctx.bezierCurveTo(
                this.x + this.w / 2, this.y - this.h / 2,
                this.x + this.w / 2, this.y + this.h / 2,
                this.x, this.y + this.h / 2);

            ctx.bezierCurveTo(
                this.x - this.w / 2, this.y + this.h / 2,
                this.x - this.w / 2, this.y - this.h / 2,
                this.x, this.y - this.h / 2);

            ctx.strokeStyle = 'hsla(180, 100%, 50%, ' + this.a + ')';
            ctx.stroke();
            ctx.closePath();

        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size * (isMobile ? 3 : 5));
        }
        this.update();
    },
    update: function() {
        if (this.y < this.hit) {
            this.y += this.vy;
        } else {
            if (this.a > .03) {
                this.w += this.vw;
                this.h += this.vh;
                if (this.w > 100) {
                    this.a *= this.va;
                    this.vw *= .98;
                    this.vh *= .98;
                }
            } else {
                this.init();
            }
        }
    }
}

function resize() {
    // Désactivé pour garder une taille fixe
    // w = c.width = window.innerWidth;
    // h = c.height = window.innerHeight;
}

function setup() {
    for (var i = 0; i < max; i++) {
        (function(j) {
            setTimeout(function() {
                var o = new O();
                o.init();
                drops.push(o);
            }, j * 200)
        }(i));
    }
}

function anim() {
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, w, h);
    for (var i in drops) {
        drops[i].draw();
    }
    requestAnimationFrame(anim);
}

window.addEventListener("resize", resize);

setup();
anim();
