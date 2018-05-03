class EventTarget {
    private _listeners;

    constructor() {
        this._listeners = {};
    }

    on(type, listener) {
        if (typeof this._listeners[type] == 'undefined') {
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
        return this;
    }

    off(type, listener) {
        if (this._listeners[type] instanceof Array) {
            var listeners = this._listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
        return this;
    }

    trigger(type, data) {
        if (this._listeners[type] instanceof Array) {
            var listeners = this._listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (data instanceof Array) {
                    listeners[i].apply(this, data);
                } else {
                    listeners[i].call(this, data);
                }
            }
        }
        return this;
    }
}

export default EventTarget;
