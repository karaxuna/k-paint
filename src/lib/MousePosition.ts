import Board from './Board';

class MousePosition {
    board: Board;
    original: { x: number, y: number } = { x: null, y: null };

    constructor(paint: Board) {
        this.board = paint;
    }

    update(e: MouseEvent) {
        let canvas = this.board.context.canvas,
            rect = canvas.getBoundingClientRect();

        this.original.x = e.clientX - rect.left;
        this.original.y = e.clientY - rect.top;
    }

    get x() {
        return this.original.x / this.board.scale.x;
    }

    get y() {
        return this.original.y / this.board.scale.y;
    }
}

export default MousePosition;
