import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, property, TemplateResult } from 'lit-element';
import {
  discoverComponentsBundle,
  discoverEntryDetails,
} from '../processes/discover';
import { ComponentsBundle } from '../types/components-bundle';
import { CircularProgressBase } from '@material/mwc-circular-progress/mwc-circular-progress-base';

export abstract class CompoDiscoverEntry extends (ScopedElementsMixin(
  LitElement
) as any) {
  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgressBase,
    };
  }

  @property({ type: String })
  entryUri!: string;
  @property({ type: Array })
  compositoryCellId!: CellId;

  abstract _appWebsocket: AppWebsocket;
  abstract _adminWebsocket: AdminWebsocket;

  #renderTemplate: TemplateResult | undefined;

  async firstUpdated() {
    const {
      dnaHash,
      zomeIndex,
      entryDefIndex,
      entryHash,
    } = await discoverEntryDetails(
      this._adminWebsocket,
      this._appWebsocket,
      this.compositoryCellId,
      this.entryUri
    );

    const { bundle, def } = await discoverComponentsBundle(
      this._appWebsocket,
      this.compositoryCellId,
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
