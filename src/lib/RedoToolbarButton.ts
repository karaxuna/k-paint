import Board from './Board';

class RedoBoardButton {
    board: Board;
    container: HTMLElement;

    constructor(board: Board) {
        this.board = board;
    }

    mount(parent: HTMLElement) {
        let container = this.container = document.createElement('button');
        container.type = 'button';
        container.className = 'k-paint__Toolbar-button k-paint__RedoBoardButton';
        container.innerHTML = '<i class="fa fa-rotate-right"></i>';
        container.title = 'Redo';
        container.addEventListener('click', this.handleClick);
        parent.appendChild(container);
    }

    handleClick = () => {
        this.board.context.history.redo();
    }
}

export default RedoBoardButton;
