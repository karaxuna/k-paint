import Board from './Board';
import MousePosition from './MousePosition';

class PencilTool {
    board: Board;
    mouse: MousePosition;
    enabled: boolean = false;

    constructor(board: Board) {
        this.board = board;
        this.mouse = new MousePosition(board);
    }

    enable() {
        this.board.context.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.board.context.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.enabled = true;
    }

    disable() {
        this.board.context.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.board.context.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.enabled = false;
    }

    handleMouseDown = (e) => {
        let context = this.board.context;
        let mouse = this.mouse;
        this.mouse.update(e);

        context.history.next();
        context.beginPath();
        context.moveTo(mouse.x, mouse.y);
        this.draw();
        context.canvas.addEventListener('mousemove', this.handleMouseMove, false);
    }

    draw() {
        this.board.context.save();
        this.board.context.lineTo(this.mouse.x, this.mouse.y);
        this.board.context.strokeStyle = this.board.color;
        this.board.context.lineWidth = this.board.size;
        this.board.context.stroke();
        this.board.context.restore();
    }

    handleMouseMove = (e) => {
        this.mouse.update(e);
        this.draw();
    }

    handleMouseUp = (e) => {
        this.board.context.canvas.removeEventListener('mousemove', this.handleMouseMove);
    }
}

export default PencilTool;
