import Toolbar from './Toolbar';
import EventTarget from './EventTarget';

class SizeToolbarButton extends EventTarget {
    toolbar: Toolbar;
    container: HTMLElement;
    button: HTMLElement;
    dropdown: HTMLElement;
    sizes: Array<number> = [1, 3, 5, 9];
    expanded = false;

    constructor(toolbar: Toolbar) {
        super();
        this.toolbar = toolbar;

        this.on('setexpanded', (e) => {
            this.expanded = e.expanded;

            if (e.expanded) {
                this.container.classList.add('k-paint__SizeToolbarButton--expanded');
                document.addEventListener('click', this.handleOutsideClick);
            }
            else {
                this.container.classList.remove('k-paint__SizeToolbarButton--expanded');
                document.removeEventListener('click', this.handleOutsideClick);
            }
        });
    }

    handleOutsideClick = (e) => {
        let parent = e.target;
        while (parent) {
            if (parent === this.dropdown || parent === this.button) {
                return;
            }
            
            parent = parent.parentNode;
        }

        this.trigger('setexpanded', { expanded: false });
    }

    mount() {
        let container = this.container = document.createElement('div');
        container.className = 'k-paint__SizeToolbarButton';
        this.toolbar.container.appendChild(container);

        let button = this.button = document.createElement('button');
        button.type = 'button';
        button.className = 'k-paint__Toolbar-button k-paint__SizeToolbarButton-button';
        button.innerHTML = '<i class="fa fa-bars"></i>';
        button.title = 'Size';
        button.addEventListener('click', this.handleClick);
        container.appendChild(button);

        let dropdown = this.dropdown = document.createElement('div');
        dropdown.className = 'k-paint__SizeToolbarButton-dropdown';
        container.appendChild(dropdown);

        this.sizes.forEach(size => {
            let line = document.createElement('button');
            line.className = 'k-paint__SizeToolbarButton-dropdown-line';
            line.style.fontSize = size + 'px';
            line.addEventListener('click', () => this.handleChange(size));
            dropdown.appendChild(line);
        });

        this.setStyle();
        this.toolbar.paint.on('setsize', this.setStyle);
    }

    handleClick = () => {
        this.trigger('setexpanded', {
            expanded: !this.expanded
        });
    }

    handleChange = (size) => {
        this.toolbar.paint.setSize(size);
        this.trigger('setexpanded', { expanded: false });
    }

    setStyle = () => {
        this.sizes.forEach((size, index) => {
            let node  = this.dropdown.childNodes[index] as HTMLElement;
            if (size === this.toolbar.paint.size) {
                node.classList.add('k-paint__SizeToolbarButton-dropdown-line--active');
            }
            else {
                node.classList.remove('k-paint__SizeToolbarButton-dropdown-line--active');
            }
        });
    }
}

export default SizeToolbarButton;
