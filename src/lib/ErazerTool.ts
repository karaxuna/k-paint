import Paint from './Paint';
import MousePosition from './MousePosition';

class ErazerTool {
    paint: Paint;
    mouse: MousePosition;
    enabled: boolean = false;
    state: CanvasRenderingContext2D;
    
    get size() {
        return this.paint.size * 4;
    }

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
        this.state = this.paint.board.history.getHistoryContext(-1);
        context.beginPath();
        context.moveTo(mouse.x, mouse.y);
        this.draw();
        context.canvas.addEventListener('mousemove', this.handleMouseMove, false);
    }

    draw() {
        this.paint.context.putImageData(
            this.state.getImageData(this.mouse.original.x - this.size, this.mouse.original.y - this.size, this.size * 2, this.size * 2),
            this.mouse.original.x - this.size,
            this.mouse.original.y - this.size
        );
    }

    handleMouseMove = (e) => {
        this.mouse.update(e);
        this.draw();
    }

    handleMouseUp = (e) => {
        this.paint.context.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.state = null;
    }
}

export default ErazerTool;
