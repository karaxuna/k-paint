import Toolbar from './Toolbar';

class RedoToolbarButton {
    toolbar: Toolbar;
    element: HTMLElement;

    constructor(toolbar: Toolbar) {
        this.toolbar = toolbar;
    }

    mount() {
        let element = this.element = document.createElement('button');
        element.type = 'button';
        element.className = 'k-paint__Toolbar-button k-paint__RedoToolbarButton';
        element.innerHTML = '<i class="fa fa-rotate-right"></i>';
        element.title = 'Redo';
        element.addEventListener('click', this.handleClick);
        this.toolbar.container.appendChild(element);
    }

    handleClick = () => {
        this.toolbar.paint.board.history.redo();
    }
}

export default RedoToolbarButton;
