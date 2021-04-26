import utils, { distance } from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors = ["#f9de59", "#e8a628", "#f98365", "#a1dffb"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: (Math.random() - 0.5) * 5,
    y: (Math.random() - 0.5) * 5,
  };
  this.radius = radius;
  this.color = color;
  this.mass = 1;
  this.opacity = 0;

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  };

  this.update = (particles) => {
    this.draw();

    for (let i = 0; i < particles.length; i++) {
      // Skip loop if it is the same particle
      if (this === particles[i]) continue;

      // Collision detection
      if (
        utils.distance(this.x, this.y, particles[i].x, particles[i].y) -
          this.radius * 2 <
        0
      ) {
        utils.resolveCollision(this, particles[i]);
      }
    }

    // Collision with the edges of the screen
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    // Mouse collision detection
    if (
      distance(mouse.x, mouse.y, this.x, this.y) < 150 &&
      this.opacity < 0.5
    ) {
      this.opacity += 0.02;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      // Contain opacity between 0 and 0.5
      this.opacity = Math.max(0, this.opacity);
    }

    // Create movement
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };
}

// Implementation
let particles;

function init() {
  particles = [];

  for (let i = 0; i < 200; i++) {
    const radius = 15;
    let x = utils.randomIntFromRange(radius, canvas.width - radius);
    let y = utils.randomIntFromRange(radius, canvas.height - radius);
    const color = utils.randomColor(colors);

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        // Check if particles are overlapping
        if (
          utils.distance(x, y, particles[j].x, particles[j].y) - radius * 2 <
          0
        ) {
          x = utils.randomIntFromRange(radius, canvas.width - radius);
          y = utils.randomIntFromRange(radius, canvas.height - radius);
        }
      }
    }

    particles.push(new Particle(x, y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update(particles);
  });
}

init();
animate();
