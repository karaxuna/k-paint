import Board from './Board';

export interface HistoryOperation {
    fn: (context: CanvasRenderingContext2D) => void,
    prop?: string
}

export interface HistoryOptions {
    stackSize?: number,
    statics?: Array<Array<HistoryOperation>>
}

class History {
    board: Board;
    original: CanvasRenderingContext2D;
    context: CanvasRenderingContext2D;
    stack: Array<Array<HistoryOperation>> = [];
    statics: Array<Array<HistoryOperation>>;
    index: number = -1;
    proxy: boolean = true;
    options: HistoryOptions;

    static defaultOptions = {
        stackSize: 5,
        statics: []
    };

    constructor(board: Board, options: HistoryOptions) {
        this.board = board;
        
        this.options = {
            ...History.defaultOptions,
            ...options
        };

        this.statics = this.options.statics;
    }

    mount() {
        this.original = this.board.container.getContext('2d');
        this.context = new Proxy<CanvasRenderingContext2D>(this.original, {
            get: (obj, prop) => {
                if (typeof obj[prop] === 'function') {
                    return (...args) => {
                        if (this.proxy) this.push(prop, (self) => self[prop].apply(self, args));
                        return obj[prop].apply(obj, args);
                    };
                }

                return obj[prop];
            },
            set: (obj, prop, value) => {
                if (this.proxy) this.push(prop, (self) => self[prop] = value);
                obj[prop] = value;
                return true;
            }
        });

        this.draw();
    }

    get operations() {
        return this.stack[this.index];
    }

    next() {
        this.stack.splice(this.index + 1, this.stack.length - this.index + 1, []);

        if (this.stack.length > this.options.stackSize + 1) {
            let ctx = this.getHistoryContext(1);
            let imageData = ctx.getImageData(0, 0, ctx.canvas.width / this.board.paint.scale.x, ctx.canvas.height / this.board.paint.scale.y);

            this.stack.splice(0, 2, [{
                prop: 'drawImage',
                fn: (context) => {
                    context.putImageData(imageData, 0, 0);
                }
            }]);
        }

        this.index = this.stack.length - 1;
    }

    get canUndo() {
        return this.index >= 0;
    }

    undo() {
        if (this.canUndo) {
            this.index -= 1;
            this.reset();
            this.draw(this.index);
        }
    }

    get canRedo() {
        return this.index < this.stack.length - 1;
    }

    redo() {
        if (this.canRedo) {
            this.index += 1;
            this.draw(this.index);
        }
    }

    draw(until: number = this.stack.length - 1, context = this.original) {
        context.setTransform(this.board.paint.scale.x, 0, 0, this.board.paint.scale.y, 0, 0);

        let i, j;

        for (i = 0; i < this.statics.length; i++) {
            for (j = 0; j < this.statics[i].length; j++) {
                this.statics[i][j].fn(context);
            }
        }

        for (i = 0; i <= until; i++) {
            for (j = 0; j < this.stack[i].length; j++) {
                this.stack[i][j].fn(context);
            }
        }
    }

    withoutProxy(fn) {
        this.proxy = false;
        fn();
        this.proxy = true;
    }

    getHistoryContext(until) {
        let context = document.createElement('canvas').getContext('2d');

        context.canvas.width = this.original.canvas.width;
        context.canvas.height = this.original.canvas.height;

        this.draw(until, context);
        return context;
    }

    push(prop, fn) {
        this.operations.push({
            prop,
            fn
        });
    }

    reset() {
        this.withoutProxy(() => {
            this.original.save();
            this.original.setTransform(1, 0, 0, 1, 0, 0);
            this.original.clearRect(0, 0, this.original.canvas.width, this.original.canvas.height);
            this.original.restore();
        });
    }
}

export default History;
