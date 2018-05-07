import Board from './Board';

class ColorBoardButton {
    board: Board;
    container: HTMLInputElement;

    constructor(board: Board) {
        this.board = board;

        this.board.on('setcolor', (e) => {
            this.container.value = e.color;
        });
    }

    mount(parent: HTMLElement) {
        let container = this.container = document.createElement('input');
        container.type = 'color';
        container.className = 'k-paint__Toolbar-button k-paint__ColorToolbarButton';
        container.textContent = 'Color';
        container.title = 'Color';
        container.value = this.board.color;
        container.addEventListener('change', this.handleChange);
        parent.appendChild(container);
    }

    handleChange = (e) => {
        this.board.setColor(e.target.value);
    }
}

export default ColorBoardButton;
