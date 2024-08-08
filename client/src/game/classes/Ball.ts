import { gravity, horizontalFriction, verticalFriction } from "../constants";
import { Obstacle, Sink } from "../objects";
import { pad, unpad } from "../padding";

export class Ball {
    private x: number;
    private y: number;
    private radius: number;
    private color: string;
    private vx: number;
    private vy: number;
    private ctx: CanvasRenderingContext2D;
    private obstacles: Obstacle[]
    private sinks: Sink[]
    private onFinish: (index: number) => void;

    constructor(x: number, y: number, radius: number, color: string, ctx: CanvasRenderingContext2D, obstacles: Obstacle[], sinks: Sink[], onFinish: (index: number) => void) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.vx = 0;
      this.vy = 0;
      this.ctx = ctx;
      this.obstacles = obstacles;
      this.sinks = sinks;
      this.onFinish = onFinish;
    }
  
    draw() {
      this.ctx.beginPath();
      // The arc method is used to draw a circle or an arc.
      // Math.PI is half a circle (180 degrees), so Math.PI * 2 completes the circle.
      this.ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  
    update() {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
  
      // Collision with obstacles
      this.obstacles.forEach(obstacle => {

        // returns the square root of the sum of squares of its arguments = hypotenuse (pythagoras theorem)
        const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);

        if (dist < pad(this.radius + obstacle.radius)) { // collision happened

          // Calculate collision angle
          const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
          
          // Reflect velocity
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          this.vx = (Math.cos(angle) * speed * horizontalFriction);
          this.vy = Math.sin(angle) * speed * verticalFriction;
  
          // Adjust position to prevent sticking
          const overlap = this.radius + obstacle.radius - unpad(dist);
          this.x += pad(Math.cos(angle) * overlap);
          this.y += pad(Math.sin(angle) * overlap);
        }
      });
  
      // Collision with sinks
      for (let i = 0; i < this.sinks.length; i++) {
        const sink = this.sinks[i];
        const a = unpad(this.x) > sink.x - sink.width / 2;
        const b = unpad(this.x) < sink.x + sink.width / 2;
        const c = unpad(this.y) + this.radius;
        const d = sink.y - sink.height / 2;

        if (a && b && (c > d)) {
            this.vx = 0;
            this.vy = 0;
            this.onFinish(i); // callback
            break;
        }
        
      }
    }
  
  }