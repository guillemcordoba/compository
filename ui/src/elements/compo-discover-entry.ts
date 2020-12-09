import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, property, TemplateResult } from 'lit-element';
import {
  discoverComponentsBundle,
  discoverEntryDetails,
} from '../processes/discover';
import { CircularProgress } from '@material/mwc-circular-progress';
import { deserializeHash } from '@holochain-open-dev/common';

export abstract class CompoDiscoverEntry extends (ScopedElementsMixin(
  LitElement
) as any) {
  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
    };
  }

  @property({ type: String })
  entryUri!: string;
  @property({ type: Array })
  compositoryCellId!: [string, string];

  abstract _appWebsocket: AppWebsocket;
  abstract _adminWebsocket: AdminWebsocket;

  #renderTemplate: TemplateResult | undefined;

  async firstUpdated() {
    const cellId: CellId = [
      deserializeHash(this.compositoryCellId[0]) as Buffer,
      deserializeHash(this.compositoryCellId[1]) as Buffer,
    ];
    
    const {
      dnaHash,
      zomeIndex,
      entryDefIndex,
      entryHash,
    } = await discoverEntryDetails(
      this._adminWebsocket,
      this._appWebsocket,
      cellId,
      this.entryUri
    );

    const { bundle, def } = await discoverComponentsBundle(
      this._appWebsocket,
      cellId,
      dnaHash,
      zomeIndex
    );

    for (const componentTag of Object.keys(bundle.components)) {
      this.defineScopedElement(componentTag, bundle.components[componentTag]);
    }

    const entryIdStr = def.entry_defs[entryDefIndex];

    this.#renderTemplate = bundle.entryRenderers[entryIdStr].render(entryHash);
  }

  render() {
    if (!this.#renderTemplate)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    return this.#renderTemplate;
  }
}
