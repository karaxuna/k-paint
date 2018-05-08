import Board from './Board';

class UndoToolbarButton {
    board: Board;
    container: HTMLElement;

    constructor(board: Board) {
        this.board = board;

        // Container
        let container = this.container = document.createElement('button');
        container.type = 'button';
        container.className = 'k-paint__Toolbar-button k-paint__UndoToolbarButton';
        container.innerHTML = '<i class="fa fa-rotate-left"></i>';
        container.title = 'Undo';
    }

    mount(parent: HTMLElement) {
        this.container.addEventListener('click', this.handleClick);
        parent.appendChild(this.container);
    }

    handleClick = () => {
        this.board.context.history.undo();
    }
}

export default UndoToolbarButton;
