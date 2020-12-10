import { __decorate } from "tslib";
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, property, query } from 'lit-element';
import { discoverRenderers, discoverEntryDetails } from '../processes/discover';
import { CircularProgress } from '@material/mwc-circular-progress';
import { deserializeHash } from '@holochain-open-dev/common';
import { CompoScope } from './compo-scope';
export class CompoDiscoverEntry extends ScopedElementsMixin(LitElement) {
    constructor() {
        super(...arguments);
        this._loading = true;
    }
    static get scopedElements() {
        return {
            'mwc-circular-progress': CircularProgress,
            'compo-scope': CompoScope,
        };
    }
    async firstUpdated() {
        const compositoryCellId = [
            deserializeHash(this.compositoryCellId[0]),
            deserializeHash(this.compositoryCellId[1]),
        ];
        const { cellId, zomeIndex, entryDefIndex, entryHash, } = await discoverEntryDetails(this._adminWebsocket, this._appWebsocket, compositoryCellId, this.entryUri);
        const { renderers, def } = await discoverRenderers(this._appWebsocket, compositoryCellId, cellId, zomeIndex);
        const entryIdStr = def.entry_defs[entryDefIndex];
        renderers.entryRenderers[entryIdStr].render(this._scope, entryHash);
        this._loading = false;
    }
    render() {
        if (!this._renderTemplate)
            return html ``;
        return html `${this._loading
            ? html `<mwc-circular-progress></mwc-circular-progress>`
            : html ``}
      <compo-scope id="scope"></compo-scope> `;
    }
}
__decorate([
    property({ type: String })
], CompoDiscoverEntry.prototype, "entryUri", void 0);
__decorate([
    property({ type: Array })
], CompoDiscoverEntry.prototype, "compositoryCellId", void 0);
__decorate([
    property({ type: Boolean })
], CompoDiscoverEntry.prototype, "_loading", void 0);
__decorate([
    query('#scope')
], CompoDiscoverEntry.prototype, "_scope", void 0);
//# sourceMappingURL=compo-discover-entry.js.map