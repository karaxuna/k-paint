import { Paint, PencilTool } from '../lib';

export default async function editImage(src) {
    return new Promise((resolve, reject) => {
        let paint = new Paint(document.getElementById('container'));
        let image = new Image();
        image.src = src;
        image.crossOrigin = 'Anonymous';

        image.onload = function (e) {
            paint.board.history.statics.push([{
                fn: (context) => {
                    context.drawImage(image, 0, 0);
                }
            }]);
        
            paint.canvas.height = image.height * (paint.canvas.width / image.width);
            paint.setScale({ x: paint.canvas.width / image.width, y: paint.canvas.height / image.height });
            paint.board.history.draw(-1);
            resolve(paint.canvas.toDataURL('image/png'));
        };

        image.onerror = function (e) {
            reject(e.error);
        };
    });
}
