import Paint from './Paint';

class MousePosition {
    paint: Paint;
    x: number;
    y: number;
    original: { x: number, y: number } = { x: null, y: null };

    constructor(paint: Paint) {
        this.paint = paint;
    }

    update(e: MouseEvent) {
        let canvas = this.paint.canvas;
        this.original.x = e.pageX - canvas.offsetLeft;
        this.original.y = e.pageY - canvas.offsetTop;
        this.x = this.original.x / this.paint.scale.x;
        this.y = this.original.y / this.paint.scale.y;
    }
}

export default MousePosition;
