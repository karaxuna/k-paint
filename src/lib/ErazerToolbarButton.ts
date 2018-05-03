import Toolbar from './Toolbar';

class ErazerToolbarButton {
    toolbar: Toolbar;
    element: HTMLElement;

    constructor(toolbar: Toolbar) {
        this.toolbar = toolbar;
    }

    setStyle = () => {
        if (this.toolbar.paint.active === 'erazer') {
            this.element.classList.add('k-paint__Toolbar-button--active');
        }
        else {
            this.element.classList.remove('k-paint__Toolbar-button--active');
        }
    }

    mount() {
        let element = this.element = document.createElement('button');
        element.type = 'button';
        element.className = 'k-paint__Toolbar-button k-paint__ErazerToolbarButton';
        element.innerHTML = '<i class="fa fa-eraser"></i>';
        element.title = 'Erazer';
        element.addEventListener('click', this.handleClick);
        this.toolbar.container.appendChild(element);

        this.setStyle();
        this.toolbar.paint.on('setactivetool', this.setStyle);
    }

    handleClick = () => {
        this.toolbar.paint.use('erazer');
    }
}

export default ErazerToolbarButton;
