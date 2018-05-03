import Paint from './Paint';
import MousePosition from './MousePosition';

class PencilTool {
    paint: Paint;
    mouse: MousePosition;
    enabled: boolean = false;

    constructor(paint) {
        this.paint = paint;
        this.mouse = new MousePosition(paint);
    }

    enable() {
        this.paint.context.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.paint.context.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.enabled = true;
    }

    disable() {
        this.paint.context.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.paint.context.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.enabled = false;
    }

    handleMouseDown = (e) => {
        let context = this.paint.context;
        let mouse = this.mouse;
        this.mouse.update(e);

        this.paint.board.history.next();
        context.beginPath();
        context.moveTo(mouse.x, mouse.y);
        this.draw();
        context.canvas.addEventListener('mousemove', this.handleMouseMove, false);
    }

    draw() {
        this.paint.context.save();
        this.paint.context.lineTo(this.mouse.x, this.mouse.y);
        this.paint.context.strokeStyle = this.paint.color;
        this.paint.context.lineWidth = this.paint.size;
        this.paint.context.stroke();
        this.paint.context.restore();
    }

    handleMouseMove = (e) => {
        this.mouse.update(e);
        this.draw();
    }

    handleMouseUp = (e) => {
        this.paint.context.canvas.removeEventListener('mousemove', this.handleMouseMove);
    }
}

export default PencilTool;
