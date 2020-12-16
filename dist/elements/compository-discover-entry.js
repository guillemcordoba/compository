import { __decorate } from "tslib";
import { html, LitElement, property, query } from 'lit-element';
import { discoverEntryDetails } from '../processes/discover';
import { fetchRenderersForZome } from '../processes/fetch-renderers';
export class CompositoryDiscoverEntry extends LitElement {
    constructor() {
        super(...arguments);
        this._loading = true;
    }
    async firstUpdated() {
        const { cellId, zomeIndex, entryDefIndex, entryHash, } = await discoverEntryDetails(this._adminWebsocket, this._compositoryService, this.entryUri);
        const { renderers, def } = await fetchRenderersForZome(this._compositoryService, cellId, zomeIndex);
        const entryIdStr = def.entry_defs[entryDefIndex];
        renderers.entryRenderers[entryIdStr].render(this._scope.shadowRoot.customElements, this._scope.shadowRoot, entryHash);
        this._loading = false;
    }
    render() {
        return html `${this._loading
            ? html `<mwc-circular-progress></mwc-circular-progress>`
            : html ``}
      <compository-scope id="scope"> </compository-scope> `;
    }
}
__decorate([
    property({ type: String })
], CompositoryDiscoverEntry.prototype, "entryUri", void 0);
__decorate([
    property({ type: Boolean })
], CompositoryDiscoverEntry.prototype, "_loading", void 0);
__decorate([
    query('#scope')
], CompositoryDiscoverEntry.prototype, "_scope", void 0);
//# sourceMappingURL=compository-discover-entry.js.map