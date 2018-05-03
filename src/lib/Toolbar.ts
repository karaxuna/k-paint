import Paint from './Paint';
import PencilToolbarButton from './PencilToolbarButton';
import ErazerToolbarButton from './ErazerToolbarButton';
import UndoToolbarButton from './UndoToolbarButton';
import RedoToolbarButton from './RedoToolbarButton';
import SizeToolbarButton from './SizeToolbarButton';
import ColorToolbarButton from './ColorToolbarButton';

class Toolbar {
    paint: Paint;
    container: HTMLElement;
    buttons: any[];

    constructor(paint: Paint) {
        this.paint = paint;
        this.buttons = [
            new PencilToolbarButton(this),
            new ErazerToolbarButton(this),
            new SizeToolbarButton(this),
            new ColorToolbarButton(this),
            new UndoToolbarButton(this),
            new RedoToolbarButton(this)
        ];
    }

    mount() {
        let container = this.container = document.createElement('div');
        container.className = 'k-paint__Toolbar';
        this.paint.container.insertBefore(container, this.paint.board.container);
        this.buttons.forEach(button => button.mount());
    }
}

export default Toolbar;
