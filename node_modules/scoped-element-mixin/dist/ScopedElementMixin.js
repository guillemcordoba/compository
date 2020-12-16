import "scoped-registries";
export const Scoped = (baseClass) => class extends baseClass {
    get scopedElements() {
        return {};
    }
    createRenderRoot() {
        return this.attachShadow({
            mode: "open",
            customElements: new CustomElementRegistry(),
        });
    }
    connectedCallback() {
        if (super.connectedCallback) {
            super.connectedCallback();
        }
        const elements = this.scopedElements;
        for (const tag of Object.keys(elements)) {
            this.shadowRoot.customElements.define(tag, elements[tag]);
        }
    }
};
//# sourceMappingURL=ScopedElementMixin.js.map