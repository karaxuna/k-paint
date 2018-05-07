import Board from './Board';

class MousePosition {
    board: Board;
    x: number;
    y: number;
    original: { x: number, y: number } = { x: null, y: null };

    constructor(paint: Board) {
        this.board = paint;
    }

    update(e: MouseEvent) {
        let canvas = this.board.context.canvas,
            rect = canvas.getBoundingClientRect();

        this.original.x = e.clientX - rect.left;
        this.original.y = e.clientY - rect.top;
        
        this.x = this.original.x / this.board.scale.x;
        this.y = this.original.y / this.board.scale.y;
    }
}

export default MousePosition;
