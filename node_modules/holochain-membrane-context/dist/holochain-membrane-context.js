import { __decorate } from "tslib";
import { css, html, LitElement, property } from 'lit-element';
import { ProviderMixin } from 'lit-element-context';
export class HolochainMembraneContext extends ProviderMixin(LitElement) {
    constructor() {
        super(...arguments);
        this.holochainMembraneContext = {
            adminWebsocket: undefined,
            appWebsocket: undefined,
            cellId: undefined,
        };
    }
    static get provide() {
        return ['holochainMembraneContext'];
    }
    updated(changedValues) {
        super.updated();
        if (!(changedValues.size === 1 &&
            changedValues.has('holochainMembraneContext'))) {
            this.holochainMembraneContext = {
                cellId: this.cellId,
                appWebsocket: this.appWebsocket,
                adminWebsocket: this.adminWebsocket,
            };
        }
    }
    static get styles() {
        return css `
      :host {
        display: contents;
      }
    `;
    }
    render() {
        return html `<slot></slot>`;
    }
}
__decorate([
    property({ type: Object })
], HolochainMembraneContext.prototype, "holochainMembraneContext", void 0);
__decorate([
    property({ type: Array })
], HolochainMembraneContext.prototype, "cellId", void 0);
__decorate([
    property({ type: Object })
], HolochainMembraneContext.prototype, "appWebsocket", void 0);
__decorate([
    property({ type: Object })
], HolochainMembraneContext.prototype, "adminWebsocket", void 0);
//# sourceMappingURL=holochain-membrane-context.js.map