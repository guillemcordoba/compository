import { __decorate } from "tslib";
import { property } from 'lit-element';
import { ConsumerMixin } from 'lit-element-context';
const membraneContextRaw = (baseClass) => class extends ConsumerMixin(baseClass) {
    static get inject() {
        return ['holochainMembraneContext'];
    }
};
export const membraneContext = (baseClass) => {
    class MembraneContextElement extends membraneContextRaw(baseClass) {
        constructor() {
            super(...arguments);
            this._adminWebsocket = undefined;
        }
        set cellId(value) {
            this.requestUpdate('cellId', this._cellId);
            this._cellId = value;
        }
        get cellId() {
            return this._cellId ? this._cellId : this.holochainMembraneContext.cellId;
        }
        set appWebsocket(value) {
            this.requestUpdate('appWebsocket', this._appWebsocket);
            this._appWebsocket = value;
        }
        get appWebsocket() {
            return this._appWebsocket
                ? this._appWebsocket
                : this.holochainMembraneContext.appWebsocket;
        }
        set adminWebsocket(value) {
            this.requestUpdate('adminWebsocket', this._adminWebsocket);
            this._adminWebsocket = value;
        }
        get adminWebsocket() {
            return this._adminWebsocket
                ? this._adminWebsocket
                : this.holochainMembraneContext.adminWebsocket;
        }
    }
    __decorate([
        property({ type: Object })
    ], MembraneContextElement.prototype, "holochainMembraneContext", void 0);
    return MembraneContextElement;
};
//# sourceMappingURL=with-membrane-context.js.map