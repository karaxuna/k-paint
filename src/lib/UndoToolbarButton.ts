import Toolbar from './Toolbar';

class UndoToolbarButton {
    toolbar: Toolbar;
    element: HTMLElement;

    constructor(toolbar: Toolbar) {
        this.toolbar = toolbar;
    }

    mount() {
        let element = this.element = document.createElement('button');
        element.type = 'button';
        element.className = 'k-paint__Toolbar-button k-paint__UndoToolbarButton';
        element.innerHTML = '<i class="fa fa-rotate-left"></i>';
        element.title = 'Undo';
        element.addEventListener('click', this.handleClick);
        this.toolbar.container.appendChild(element);
    }

    handleClick = () => {
        this.toolbar.paint.board.history.undo();
    }
}

export default UndoToolbarButton;
