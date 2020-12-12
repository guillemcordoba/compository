import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, } from 'lit-element';
export class CompoScope extends ScopedElementsMixin(LitElement) {
    constructor() {
        super(...arguments);
        this.customElements = new CustomElementRegistry();
    }
    createRenderRoot() {
        return this.attachShadow({
            mode: 'open',
            customElements: this.customElements,
        });
    }
    render() {
        return html ``;
    }
}
//# sourceMappingURL=compo-scope.js.map