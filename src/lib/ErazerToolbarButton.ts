import Board from './Board';

class ErazerToolbarButton {
    board: Board;
    container: HTMLElement;

    constructor(board: Board) {
        this.board = board;
    }

    setStyle = () => {
        if (this.board.activeToolName === 'erazer') {
            this.container.classList.add('k-paint__Toolbar-button--active');
        }
        else {
            this.container.classList.remove('k-paint__Toolbar-button--active');
        }
    }

    mount(parent: HTMLElement) {
        let container = this.container = document.createElement('button');
        container.type = 'button';
        container.className = 'k-paint__Toolbar-button k-paint__ErazerToolbarButton';
        container.innerHTML = '<i class="fa fa-eraser"></i>';
        container.title = 'Erazer';
        container.addEventListener('click', this.handleClick);
        parent.appendChild(container);

        this.setStyle();
        this.board.on('setactivetool', this.setStyle);
    }

    handleClick = () => {
        this.board.use('erazer');
    }
}

export default ErazerToolbarButton;
