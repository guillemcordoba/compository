import { html, LitElement, property, query } from 'lit-element';
import { discoverEntryDetails } from '../processes/discover';
import { CompositoryScope } from './compository-scope';
import { fetchRenderersForZome } from '../processes/fetch-renderers';
import { membraneContext } from 'holochain-membrane-context';
import { CompositoryService } from '../services/compository-service';
import { AdminWebsocket } from '@holochain/conductor-api';

export class CompositoryDiscoverEntry extends membraneContext(LitElement) {
  @property({ type: String })
  entryUri!: string;

  @property({ type: Boolean })
  _loading = true;

  @query('#scope')
  _scope!: CompositoryScope;

  async firstUpdated() {
    const compositoryService = new CompositoryService(
      this.appWebsocket,
      this.cellId
    );
    const {
      cellId,
      zomeIndex,
      entryDefIndex,
      entryHash,
    } = await discoverEntryDetails(
      this.adminWebsocket as AdminWebsocket,
      compositoryService,
      this.entryUri
    );

    const [def, renderers] = await fetchRenderersForZome(
      compositoryService,
      cellId,
      zomeIndex
    );

    if (renderers) {
      const entryIdStr = def.entry_defs[entryDefIndex];
      renderers.entry[entryIdStr].render(
        this._scope.shadowRoot as ShadowRoot,
        this.appWebsocket,
        cellId,
        entryHash
      );
    }

    this._loading = false;
  }

  render() {
    return html`${this._loading
        ? html`<mwc-circular-progress></mwc-circular-progress>`
        : html``}
      <compository-scope id="scope"> </compository-scope> `;
  }
}
