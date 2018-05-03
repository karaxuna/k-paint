import Toolbar from './Toolbar';

class PencilToolbarButton {
    toolbar: Toolbar;
    element: HTMLElement;

    constructor(toolbar: Toolbar) {
        this.toolbar = toolbar;
    }

    setStyle = () => {
        if (this.toolbar.paint.active === 'pencil') {
            this.element.classList.add('k-paint__Toolbar-button--active');
            this.toolbar.paint.board.container.style.setProperty('cursor', 'crosshair');
        }
        else {
            this.element.classList.remove('k-paint__Toolbar-button--active');
            this.toolbar.paint.board.container.style.removeProperty('cursor');
        }
    }

    mount() {
        let element = this.element = document.createElement('button');
        element.type = 'button';
        element.className = 'k-paint__Toolbar-button k-paint__PencilToolbarButton';
        element.innerHTML = '<i class="fa fa-pencil"></i>';
        element.title = 'Pencil';
        element.addEventListener('click', this.handleClick);
        this.toolbar.container.appendChild(element);

        this.setStyle();
        this.toolbar.paint.on('setactivetool', this.setStyle);
    }

    handleClick = () => {
        this.toolbar.paint.use('pencil');
    }
}

export default PencilToolbarButton;
