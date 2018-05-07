import Board from './Board';
import History from './History';
import MousePosition from './MousePosition';

class ErazerTool {
    board: Board;
    mouse: MousePosition;
    enabled: boolean = false;
    state: CanvasRenderingContext2D;
    
    get size() {
        return this.board.size * 4;
    }

    constructor(board) {
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

        let tmp = Board.fromBoard(this.board);
        tmp.container.width = this.board.context.canvas.width;
        tmp.container.height = this.board.context.canvas.height;
        tmp.draw();
        this.state = tmp.context.original;

        this.board.context.history.next();
        context.beginPath();
        context.moveTo(mouse.x, mouse.y);
        this.draw();
        context.canvas.addEventListener('mousemove', this.handleMouseMove, false);
    }

    draw() {
        this.board.context.putImageData(
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
        this.board.context.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.state = null;
    }
}

export default ErazerTool;
