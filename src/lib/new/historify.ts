interface HistoryOperation {
    (): void;
}

interface HistoryRecord {
    fixed: boolean;
    operations: Array<HistoryOperation>
}

class History<TTarget> {
    records: Array<HistoryRecord>;
    index: number;
    context: TTarget;

    get operations() {
        return this.records[this.index].operations;
    }

    constructor(context: TTarget, records: Array<HistoryRecord> = [], index: number = records.length) {
        this.context = context;
        this.records = records;
        this.index = index;
    }

    static fromHistory<TTarget>(history: History<TTarget>) {
        return new this(history.context, history.records);
    }

    next(fixed = false) {
        this.records.splice(this.index + 1, this.records.length - this.index + 1, {
            operations: [],
            fixed
        });

        this.index = this.records.length - 1;
    }

    canUndo() {
        return this.index > 0 && !this.records[this.index - 1].fixed;
    }

    undo() {
        if (this.canUndo()) {
            this.index -= 1;
            this.recall(0, this.index);
        }
    }

    canRedo() {
        return this.index < this.records.length - 1 && !this.records[this.index + 1].fixed;
    }

    redo() {
        if (this.canRedo()) {
            this.index += 1;
            this.recall(this.index - 1, this.index);
        }
    }

    recall(from: number, to: number) {
        let i, j,
            record;

        for (i = 0; i <= to; i++) {
            record = this.records[i];

            if (!record) {
                continue;
            }

            if (record.fixed || i >= from) {
                for (j = 0; j < this.records[i].operations.length; j++) {
                    this.records[i].operations[i].call(this.context);
                }
            }
        }
    }
}

export default function historify<TTarget extends Object>(target: TTarget) {
    let history = new History(target);

    return new Proxy(target, {
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
    });
}
