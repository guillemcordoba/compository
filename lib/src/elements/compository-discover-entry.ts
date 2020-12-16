import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { html, LitElement, property, query, TemplateResult } from 'lit-element';
import { discoverRenderers, discoverEntryDetails } from '../processes/discover';
import { deserializeHash } from '@holochain-open-dev/common';
import { CompositoryScope } from './compository-scope';
import { CompositoryService } from '../services/compository-service';

export abstract class CompositoryDiscoverEntry extends LitElement {
  @property({ type: String })
  entryUri!: string;

  abstract _compositoryService: CompositoryService;
  abstract _adminWebsocket: AdminWebsocket;

  @property({ type: Boolean })
  _loading = true;

  @query('#scope')
  _scope!: CompositoryScope;

  async firstUpdated() {
    const {
      cellId,
      zomeIndex,
      entryDefIndex,
      entryHash,
    } = await discoverEntryDetails(
      this._adminWebsocket,
      this._compositoryService,
      this.entryUri
    );

    const { renderers, def } = await discoverRenderers(
      this._compositoryService,
      cellId,
      zomeIndex
    );

    const entryIdStr = def.entry_defs[entryDefIndex];
    renderers.entryRenderers[entryIdStr].render(
      ((this._scope.shadowRoot as any).customElements) as any,
      this._scope.shadowRoot as ShadowRoot,
      entryHash
    );

    this._loading = false;
  }

  render() {
    return html`${this._loading
        ? html`<mwc-circular-progress></mwc-circular-progress>`
        : html``}
      <compository-scope id="scope"> </compository-scope> `;
  }
}
