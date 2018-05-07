import EventTarget from './EventTarget';
import History, { historify, IHistorified } from './History';
import PencilTool from './PencilTool';
import ErazerTool from './ErazerTool';

export interface IPaintTool {
    enable: () => void,
    disable: () => void,
    enabled: boolean
}

export interface IPaintTools {
    [key: string]: IPaintTool
}

export interface IBoardScale {
    x: number,
    y: number
}

export interface IBoardOperation {
    (context: CanvasRenderingContext2D): void
}

export interface IBoardOptions {
    color?: string,
    scale?: IBoardScale,
    activeToolName?: string,
    statics?: Array<Array<IBoardOperation>>
}

class Board extends EventTarget {
    context: IHistorified<CanvasRenderingContext2D>;
    container: HTMLCanvasElement;
    options: IBoardOptions;
    tools: IPaintTools;
    activeToolName: string;
    color: string = '#787878';
    size: number = .5;
    scale: IBoardScale;
    statics: Array<Array<IBoardOperation>>;

    static defaultOptions: IBoardOptions = {
        color: '#787878',
        scale: { x: 1, y: 1 },
        activeToolName: 'pencil',
        statics: []
    };

    static fromBoard(board: Board) {
        return new Board({
            color: board.color,
            scale: board.scale,
            activeToolName: board.activeToolName,
            statics: board.statics
        });
    }

    constructor(options: IBoardOptions = {}) {
        super();

        options = this.options = {
            ...Board.defaultOptions,
            ...options
        };

        this.color = options.color;
        this.scale = options.scale;
        this.statics = options.statics;

        // Container
        let container = this.container = document.createElement('canvas');
        container.className = 'k-paint__Board';
        this.context = historify(container.getContext('2d'));

        this.context.history.on('change', ({ fromIndex, toIndex }) => {
            this.draw(fromIndex > toIndex ? 0 : this.statics.length + fromIndex, this.statics.length + toIndex);
        });

        // Tools
        this.tools = {
            pencil: new PencilTool(this),
            erazer: new ErazerTool(this)
        };

        // Event handlers
        this.on('setactivetool', (e) => {
            if (this.tools[this.activeToolName]) this.tools[this.activeToolName].disable();
            this.activeToolName = e.activeToolName;
            this.tools[e.activeToolName].enable();
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

        this.use(this.options.activeToolName);
        this.draw();
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        this.container.width = (this.container.parentNode as HTMLElement).clientWidth;
        this.container.height = (this.container.parentNode as HTMLElement).clientHeight;
    }

    use(activeToolName: string) {
        this.trigger('setactivetool', {
            activeToolName
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

    draw(fromIndex: number = 0, toIndex: number = this.context.history.records.length) {
        this.context.original.setTransform(this.scale.x, 0, 0, this.scale.y, 0, 0);

        this.statics.concat(this.context.history.records)
            .filter((record, index) => index >= fromIndex && index <= toIndex)
            .reduce((operations, record) => operations.concat(record), [])
            .forEach(operation => operation(this.context.original));
    }

    export(mimeType: string = 'image/png') {
        return this.context.canvas.toDataURL(mimeType);
    }
}

export default Board;
