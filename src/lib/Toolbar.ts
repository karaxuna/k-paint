import Board from './Board';
import PencilToolbarButton from './PencilToolbarButton';
import ErazerToolbarButton from './ErazerToolbarButton';
import UndoToolbarButton from './UndoToolbarButton';
import RedoToolbarButton from './RedoToolbarButton';
import SizeToolbarButton from './SizeToolbarButton';
import ColorToolbarButton from './ColorToolbarButton';

class Toolbar {
    board: Board;
    container: HTMLElement;
    buttons: Array<PencilToolbarButton | ErazerToolbarButton | UndoToolbarButton | RedoToolbarButton | SizeToolbarButton | ColorToolbarButton>;

    constructor(board: Board) {
        // Container
        this.container = document.createElement('div');
        this.container.className = 'k-paint__Toolbar';

        // Board
        this.board = board;

        // Toolbar buttons
        this.buttons = [
            new PencilToolbarButton(board),
            new ErazerToolbarButton(board),
            new SizeToolbarButton(board),
            new ColorToolbarButton(board),
            new UndoToolbarButton(board),
            new RedoToolbarButton(board)
        ];
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
        this.buttons.forEach(button => button.mount(this.container));
    }
}

export default Toolbar;
