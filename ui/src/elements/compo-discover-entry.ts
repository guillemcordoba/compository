import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, property, query, TemplateResult } from 'lit-element';
import { discoverRenderers, discoverEntryDetails } from '../processes/discover';
import { CircularProgress } from '@material/mwc-circular-progress';
import { deserializeHash } from '@holochain-open-dev/common';
import { CompoScope } from './compo-scope';

export abstract class CompoDiscoverEntry extends (ScopedElementsMixin(
  LitElement
) as any) {
  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
      'compo-scope': CompoScope,
    };
  }

  @property({ type: String })
  entryUri!: string;
  @property({ type: Array })
  compositoryCellId!: [string, string];

  abstract _appWebsocket: AppWebsocket;
  abstract _adminWebsocket: AdminWebsocket;

  @property({ type: Boolean })
  _loading: boolean = true;

  @query('#scope')
  _scope!: CompoScope;

  async firstUpdated() {
    const compositoryCellId: CellId = [
      deserializeHash(this.compositoryCellId[0]) as Buffer,
      deserializeHash(this.compositoryCellId[1]) as Buffer,
    ];

    const {
      cellId,
      zomeIndex,
      entryDefIndex,
      entryHash,
    } = await discoverEntryDetails(
      this._adminWebsocket,
      this._appWebsocket,
      compositoryCellId,
      this.entryUri
    );

    const { renderers, def } = await discoverRenderers(
      this._appWebsocket,
      compositoryCellId,
      cellId,
      zomeIndex
    );

    const entryIdStr = def.entry_defs[entryDefIndex];
    debugger;
    renderers.entryRenderers[entryIdStr].render(this._scope, entryHash);

    console.log(this._scope.getScopedTagName('hod-calendar-event'))
    this._loading = false;
  }

  render() {
    return html`${this._loading
        ? html`<mwc-circular-progress></mwc-circular-progress>`
        : html``}
      <compo-scope id="scope">
      <hod-calendar-event></hod-calendar-event>
      </compo-scope> `;
  }
}
