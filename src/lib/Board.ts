import Paint from './Paint';
import History, { HistoryOptions } from './History';

export interface BoardOptions extends HistoryOptions {
    
}

class Board {
    paint: Paint;
    history: History;
    container: HTMLCanvasElement;
    options: BoardOptions;

    static defaultOptions = {
        
    };

    constructor(paint: Paint, options: BoardOptions) {
        this.options = {
            ...Board.defaultOptions,
            ...options
        };

        this.paint = paint;
        this.history = new History(this, options);
    }

    mount() {
        let container = this.container = document.createElement('canvas');
        container.className = 'k-paint__Board';
        this.paint.container.appendChild(container);
        container.width = (container.parentNode as HTMLElement).clientWidth;
        container.height = (container.parentNode as HTMLElement).clientHeight;
        this.history.mount();
    }
}

export default Board;
