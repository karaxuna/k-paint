import { Paint, PencilTool } from '../lib';

export default async function editImage(src) {
    return new Promise((resolve, reject) => {
        let container = document.getElementById('container');
        let paint = (window as any).paint = new Paint();
        paint.mount(container);

        let image = new Image();
        image.src = src;
        image.crossOrigin = 'Anonymous';

        image.onload = function (e) {
            paint.board.statics.push([function (context) {
                context.drawImage(image, 0, 0);
            }]);
        
            let scale = paint.board.context.canvas.width / image.width;
            paint.board.setHeight(image.height * scale);
            paint.board.setWidth(image.width * scale);
            paint.board.setScale({ x: paint.board.context.canvas.width / image.width, y: paint.board.context.canvas.height / image.height });
            paint.board.draw();
            resolve();
        };

        image.onerror = function (e) {
            reject(e.error);
        };
    });
}
