import EventTarget from './EventTarget';

export interface HistoryOperation<TTarget> {
    (this: TTarget): void;
}

export default class History<TTarget> extends EventTarget {
    records: Array<Array<HistoryOperation<TTarget>>>;
    index: number;

    get operations() {
        return this.records[this.index];
    }

    constructor(context: TTarget, records: Array<Array<HistoryOperation<TTarget>>> = [], index: number = records.length) {
        super();
        this.records = records;
        this.index = index;

        this.on('change', (e) => {
            this.index = e.toIndex;
        });
    }

    next(operations: Array<HistoryOperation<TTarget>> = []) {
        this.index = this.records.push(operations) - 1;
    }

    canUndo() {
        return this.index >= 0;
    }

    undo() {
        if (this.canUndo()) {
            this.trigger('change', {
                fromIndex: this.index,
                toIndex: this.index - 1
            });
        }
    }

    canRedo() {
        return this.index < this.records.length - 1;
    }

    redo() {
        if (this.canRedo()) {
            this.trigger('change', {
                fromIndex: this.index,
                toIndex: this.index + 1
            });
        }
    }
}

export type IHistorified<TTarget> = TTarget & {
    original: TTarget,
    history: History<TTarget>
}

export function historify<TTarget>(target: TTarget) {
    let history = new History(target);

    return new Proxy(target as any, {
        get(obj, prop) {
            switch (prop) {
                case 'original':
                    return target;
                case 'history':
                    return history;
            }

            if (typeof obj[prop] === 'function') {
                return (...args) => {
                    history.operations.push(function () { this[prop].apply(this, args); });
                    return obj[prop].apply(obj, args);
                };
            }

            return obj[prop];
        },
        set(obj, prop, value) {
            history.operations.push(function () { this[prop] = value; });
            obj[prop] = value;
            return true;
        }
    }) as IHistorified<TTarget>;
}
