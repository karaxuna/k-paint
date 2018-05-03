import EventTarget from './EventTarget';
import History, { HistoryOptions } from './History';
import Toolbar from './Toolbar';
import Board, { BoardOptions } from './Board';
import PencilTool from './PencilTool';
import ErazerTool from './ErazerTool';

export interface PaintTool {
    enable: () => void;
    disable: () => void;
    enabled: boolean;
}

export interface PaintTools {
    [key: string]: PaintTool
}

export interface PaintOptions extends BoardOptions, HistoryOptions {
    scale?: { x: number, y: number }
}

class Paint extends EventTarget {
    board: Board;
    toolbar: Toolbar;
    container: HTMLElement;
    tools: PaintTools;
    active: string;
    color: string = '#787878';
    size: number = .5;
    scale: { x: number, y: number };
    options: PaintOptions;

    static defaultOptions = {
        scale: { x: 1, y: 1 }
    }

    constructor(container: HTMLElement, options: PaintOptions = {} as any) {
        super();
        this.container = container;
        this.options = { ...Paint.defaultOptions, ...options };
        this.board = new Board(this, options);
        this.toolbar = new Toolbar(this);

        this.tools = {
            pencil: new PencilTool(this),
            erazer: new ErazerTool(this)
        };

        this.on('setactivetool', (e) => {
            if (this.tools[this.active]) this.tools[this.active].disable();
            this.active = e.active;
            this.tools[e.active].enable();
            this.trigger('setsize', { size: .5 });
        });
        
        this.on('setcolor', (e) => {
            this.color = e.color;
        });

        this.on('setsize', (e) => {
            this.size = e.size;
        });
        
        this.on('setscale', (e) => {
            this.scale = e.scale;
        });

        this.mount();
    }

    mount() {
        this.container.classList.add('k-paint__Paint');
        this.setScale(this.options.scale);
        this.board.mount();
        this.toolbar.mount();
        this.use('pencil');
    }

    get context() {
        return this.board.history.context;
    }

    get canvas() {
        return this.context.canvas;
    }

    use(active: string) {
        this.trigger('setactivetool', {
            active
        });
    }

    setColor(color: string) {
        this.trigger('setcolor', {
            color
        });
    }

    setSize(size: number) {
        this.trigger('setsize', {
            size
        });
    }

    setScale(scale) {
        this.trigger('setscale', {
            scale
        });
    }
}

export default Paint;
