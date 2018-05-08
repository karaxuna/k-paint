import { merge } from './Utils';
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
    statics?: Array<Array<IBoardOperation>>,
    records?: Array<Array<IBoardOperation>>,
    index?: number
}

class Board extends EventTarget {
    context: IHistorified<CanvasRenderingContext2D>;
    container: HTMLDivElement;
    background: CanvasRenderingContext2D;
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
        statics: [],
        records: [],
        index: -1
    };

    static fromBoard(board: Board) {
        return new Board({
            color: board.color,
            scale: board.scale,
            activeToolName: board.activeToolName,
            statics: board.statics,
            records: board.context.history.records,
            index: board.context.history.index
        });
    }

    constructor(options: IBoardOptions = {}) {
        super();

        options = this.options = merge([
            Board.defaultOptions,
            options
        ]);

        this.color = options.color;
        this.scale = options.scale;
        this.statics = options.statics;

        // Container
        let container = this.container = document.createElement('div');
        container.className = 'k-paint__Board';

        // Background
        this.background = document.createElement('canvas').getContext('2d');
        this.container.appendChild(this.background.canvas);

        // Init context
        this.context = historify(document.createElement('canvas').getContext('2d'), options.records, options.index);
        this.container.appendChild(this.context.canvas);

        this.context.history.on('change', ({ fromIndex, toIndex }) => {
            this.draw(fromIndex, toIndex);
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

        this.on('setwidth', (e) => {
            this.context.canvas.width = this.background.canvas.width = e.width;
        });

        this.on('setheight', (e) => {
            this.context.canvas.height = this.background.canvas.height = e.height;
        });

        this.use(this.options.activeToolName);
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        this.context.canvas.width = this.background.canvas.width = (this.container.parentNode as HTMLElement).clientWidth;
        this.context.canvas.height = this.background.canvas.width = (this.container.parentNode as HTMLElement).clientHeight;
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

    setWidth(width: number) {
        this.trigger('setwidth', {
            width
        });
    }

    setHeight(height: number) {
        this.trigger('setheight', {
            height
        });
    }

    draw(fromIndex: number = 0, toIndex: number = this.context.history.index) {
        this.drawStatics();
        this.drawDynamics(fromIndex, toIndex);
    }

    drawDynamics(fromIndex: number = 0, toIndex: number = this.context.history.index) {
        // If fromIndex > toIndex then clear canvas and draw from beginning
        if (fromIndex > toIndex) {
            this.clear();
            fromIndex = 0;
        }

        // Apply props
        this.context.original.setTransform(this.scale.x, 0, 0, this.scale.y, 0, 0);

        // Draw each record
        this.context.history.records
            .filter((record, index) => index >= fromIndex && index <= toIndex)
            .reduce((operations, record) => operations.concat(record), [])
            .forEach(operation => operation(this.context.original));
    }

    drawStatics() {
        // Apply props
        this.background.setTransform(this.scale.x, 0, 0, this.scale.y, 0, 0);

        // Draw each record
        this.statics.forEach(record => record.forEach(operation => operation(this.background)));
    }

    clear() {
        this.context.original.save();
        this.context.original.setTransform(1, 0, 0, 1, 0, 0);
        this.context.original.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.original.restore();
    }

    export(mimeType: string = 'image/png') {
        let board = Board.fromBoard(this);
        board.setWidth(this.context.canvas.width / board.scale.x);
        board.setHeight(this.context.canvas.height / board.scale.y);
        board.setScale({ x: 1, y: 1 });
        board.draw();
        board.background.drawImage(board.context.canvas, 0, 0);
        return board.background.canvas.toDataURL(mimeType);
    }
}

export default Board;
