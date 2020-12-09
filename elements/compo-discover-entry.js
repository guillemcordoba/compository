var _renderTemplate;
import { __classPrivateFieldGet, __classPrivateFieldSet, __decorate } from "tslib";
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, property } from 'lit-element';
import { discoverComponentsBundle, discoverEntryDetails, } from '../processes/discover';
import { CircularProgressBase } from '@material/mwc-circular-progress/mwc-circular-progress-base';
export class CompoDiscoverEntry extends ScopedElementsMixin(LitElement) {
    constructor() {
        super(...arguments);
        _renderTemplate.set(this, void 0);
    }
    static get scopedElements() {
        return {
            'mwc-circular-progress': CircularProgressBase,
        };
    }
    async firstUpdated() {
        const { dnaHash, zomeIndex, entryDefIndex, entryHash, } = await discoverEntryDetails(this._adminWebsocket, this._appWebsocket, this.compositoryCellId, this.entryUri);
        const { bundle, def } = await discoverComponentsBundle(this._appWebsocket, this.compositoryCellId, dnaHash, zomeIndex);
        for (const componentTag of Object.keys(bundle.components)) {
            this.defineScopedElement(componentTag, bundle.components[componentTag]);
        }
        const entryIdStr = def.entry_defs[entryDefIndex];
        __classPrivateFieldSet(this, _renderTemplate, bundle.entryRenderers[entryIdStr].render(entryHash));
    }
    render() {
        if (!__classPrivateFieldGet(this, _renderTemplate))
            return html `<mwc-circular-progress></mwc-circular-progress>`;
        return __classPrivateFieldGet(this, _renderTemplate);
    }
}
_renderTemplate = new WeakMap();
__decorate([
    property({ type: String })
], CompoDiscoverEntry.prototype, "entryUri", void 0);
__decorate([
    property({ type: Array })
], CompoDiscoverEntry.prototype, "compositoryCellId", void 0);
//# sourceMappingURL=compo-discover-entry.js.map