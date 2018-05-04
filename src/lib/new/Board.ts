import historify from './historify';

class Board {
    context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = historify(context);
    }
}

export default Board;
