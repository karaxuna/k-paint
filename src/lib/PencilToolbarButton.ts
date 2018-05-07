import Board from './Board';

class PencilBoardButton {
    board: Board;
    container: HTMLElement;

    constructor(board: Board) {
        this.board = board;
    }

    setStyle = () => {
        if (this.board.activeToolName === 'pencil') {
            this.container.classList.add('k-paint__Toolbar-button--active');
            this.board.container.style.setProperty('cursor', 'crosshair');
        }
        else {
            this.container.classList.remove('k-paint__Toolbar-button--active');
            this.board.container.style.removeProperty('cursor');
        }
    }

    mount(parent: HTMLElement) {
        let container = this.container = document.createElement('button');
        container.type = 'button';
        container.className = 'k-paint__Toolbar-button k-paint__PencilBoardButton';
        container.innerHTML = '<i class="fa fa-pencil"></i>';
        container.title = 'Pencil';
        container.addEventListener('click', this.handleClick);
        parent.appendChild(container);

        this.setStyle();
        this.board.on('setactivetool', this.setStyle);
    }

    handleClick = () => {
        this.board.use('pencil');
    }
}

export default PencilBoardButton;
