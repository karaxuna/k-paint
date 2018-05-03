import Toolbar from './Toolbar';

class ColorToolbarButton {
    toolbar: Toolbar;
    element: HTMLInputElement;

    constructor(toolbar: Toolbar) {
        this.toolbar = toolbar;

        this.toolbar.paint.on('setcolor', (e) => {
            this.element.value = e.color;
        });
    }

    mount() {
        let element = this.element = document.createElement('input');
        element.type = 'color';
        element.className = 'k-paint__Toolbar-button k-paint__ColorToolbarButton';
        element.textContent = 'Color';
        element.title = 'Color';
        element.value = this.toolbar.paint.color;
        element.addEventListener('change', this.handleChange);
        this.toolbar.container.appendChild(element);
    }

    handleChange = (e) => {
        this.toolbar.paint.setColor(e.target.value);
    }
}

export default ColorToolbarButton;
