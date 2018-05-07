import { Paint, PencilTool } from '../lib';

export default async function editImage(src) {
    return new Promise((resolve, reject) => {
        let container = document.getElementById('container');
        let paint = new Paint();
        paint.mount(container);

        let image = new Image();
        image.src = src;
        image.crossOrigin = 'Anonymous';

        image.onload = function (e) {
            paint.board.statics.push([function () {
                this.drawImage(image, 0, 0);
            }]);
        
            paint.board.context.canvas.height = image.height * (paint.board.context.canvas.width / image.width);
            paint.board.setScale({ x: paint.board.context.canvas.width / image.width, y: paint.board.context.canvas.height / image.height });
            paint.board.draw();
            resolve();
        };

        image.onerror = function (e) {
            reject(e.error);
        };
    });
}
