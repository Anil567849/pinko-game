import { HEIGHT, WIDTH, ballRadius, obstacleRadius, sinkWidth } from "../constants";
import { Obstacle, Sink, createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "./Ball";

export class BallManager {
    private balls: Ball[]; // it will store all balls
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private obstacles: Obstacle[] // it will obstacle x-y points
    private sinks: Sink[] // it will container x-y points
    private requestId?: number;
    private onFinish?: (index: number,startX?: number) => void;

    constructor(canvasRef: HTMLCanvasElement, onFinish?: (index: number,startX?: number) => void) {
        this.balls = [];
        this.canvasRef = canvasRef;
        this.ctx = canvasRef.getContext("2d")!;
        this.obstacles = createObstacles(); // store x, y
        this.sinks = createSinks(); // store x, y
        this.update();
        this.onFinish = onFinish;
    }

    addBall(startX?: number) {
        let x = startX || pad(WIDTH / 2 + 13);
        let y = pad(50);
        const finish = (index: number) => {
            this.balls = this.balls.filter(ball => ball !== newBall); // remove the ball
            this.onFinish?.(index, startX)
        }
        const newBall = new Ball(x, y, ballRadius, 'red', this.ctx, this.obstacles, this.sinks, finish);
        this.balls.push(newBall);
    }

    drawObstacles() {
        this.ctx.fillStyle = 'white';

        this.obstacles.forEach((obstacle) => {
            this.ctx.beginPath();
            // The arc method is used to draw a circle or an arc.
            // Math.PI is half a circle (180 degrees), so Math.PI * 2 completes the circle.
            this.ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        });
    }
  
    getColor(index: number) {
        if (index <3 || index > this.sinks.length - 3) {
            return {background: '#ff003f', color: 'white'};
        }
        if (index < 6 || index > this.sinks.length - 6) {
            return {background: '#ff7f00', color: 'white'};
        }
        if (index < 9 || index > this.sinks.length - 9) {
            return {background: '#ffbf00', color: 'black'};
        }
        if (index < 12 || index > this.sinks.length - 12) {
            return {background: '#ffff00', color: 'black'};
        }
        if (index < 15 || index > this.sinks.length - 15) {
            return {background: '#bfff00', color: 'black'};
        }
        return {background: '#7fff00', color: 'black'};
    }

    drawSinks() {
        const SPACING = obstacleRadius * 2;
        for (let i = 0; i < this.sinks.length; i++)  {

            // filling the box 
            this.ctx.fillStyle = this.getColor(i).background;
            const sink = this.sinks[i];
            this.ctx.font='normal 13px Arial';
            let {x, y, w, h} = {
                x: sink.x,
                y: sink.y - sink.height / 2,
                w: sink.width - SPACING,
                h: sink.height,
            }
            this.ctx.fillRect(x, y, w, h);

            // filling the text 
            this.ctx.fillStyle = this.getColor(i).color;
            let text = (sink?.multiplier)?.toString() + "x";
            let textX = sink.x - 15 + sinkWidth / 2;
            let textY = sink.y;
            this.ctx.fillText(text, textX, textY);
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT); // first clear the canvas

        // put obstacles, sinks, and balls again 
        this.drawObstacles();
        this.drawSinks();
        this.balls.forEach(ball => {
            ball.draw();
            ball.update();
        });
    }
    
    update() {
        this.draw();
        /*
        The requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.
        Note: Your callback routine must itself call requestAnimationFrame() if you want to animate another frame at the next repaint.
        */
        this.requestId = requestAnimationFrame(this.update.bind(this)); // update function run infinitely
    }

    stop() {
        if(this.requestId) cancelAnimationFrame(this.requestId);        
    }
}