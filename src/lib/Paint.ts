import EventTarget from './EventTarget';
import Toolbar from './Toolbar';
import Board, { IBoardOptions } from './Board';
import PencilTool from './PencilTool';
import ErazerTool from './ErazerTool';

export interface IPaintOptions extends IBoardOptions {
    
}

class Paint extends EventTarget {
    board: Board;
    toolbar: Toolbar;
    container: HTMLElement;
    options: IPaintOptions;

    static defaultOptions: IPaintOptions = {
        
    }

    constructor(options: IPaintOptions = {}) {
        super();
        
        this.options = {
            ...Paint.defaultOptions,
            ...options
        };

        // Container
        this.container = document.createElement('div');
        this.container.classList.add('k-paint__Paint');

        // Parts
        this.board = new Board();
        this.toolbar = new Toolbar(this.board);
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        this.toolbar.mount(this.container);
        this.board.mount(this.container);
    }
}

export default Paint;
