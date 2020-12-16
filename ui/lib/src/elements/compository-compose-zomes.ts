import { html, LitElement, property, query } from 'lit-element';
import { Scoped } from 'scoped-element-mixin';
import { CompositoryService } from '../services/compository-service';
import { DnaTemplate, Hashed, ZomeDef, ZomeDefReference } from '../types/dnas';
import { sharedStyles } from './sharedStyles';
import { Button } from '@material/mwc-button';
import { List, SelectedDetail } from '@material/mwc-list';
import { CheckListItem } from '@material/mwc-list/mwc-check-list-item';
import { CircularProgress } from '@material/mwc-circular-progress';
import { bundleDna } from '../processes/compress-dna';
import { downloadFile } from '../processes/download-file';
import { CompositoryInstallDnaDialog } from './compository-install-dna-dialog';
import { AdminWebsocket } from '@holochain/conductor-api';

export abstract class CompositoryComposeZomes extends Scoped(LitElement) {
  @property()
  zomeDefs!: Array<Hashed<ZomeDef>>;

  @query('#install-dna-dialog')
  _installDnaDialog!: CompositoryInstallDnaDialog;

  _selectedIndexes: Set<number> = new Set();

  abstract _compositoryService: CompositoryService;
  abstract _adminWebsocket: AdminWebsocket;

  static get styles() {
    return sharedStyles;
  }

  get scopedElements() {
    const ws = this._adminWebsocket;
    return {
      'mwc-list': List,
      'mwc-check-list-item': CheckListItem,
      'mwc-circular-progress': CircularProgress,
      'mwc-button': Button,
      'compository-install-dna-dialog': class extends CompositoryInstallDnaDialog {
        get _adminWebsocket() {
          return ws;
        }
      } as typeof HTMLElement,
    };
  }

  async firstUpdated() {
    this.zomeDefs = await this._compositoryService.getAllZomeDefs();
  }

  async createDnaTemplate() {
    const zomeDefs: Array<Hashed<ZomeDef>> = Array.from(
      this._selectedIndexes
    ).map(i => this.zomeDefs[i]);

    const zomeDefReferences: Array<ZomeDefReference> = zomeDefs.map(def => ({
      name: def.content.name,
      zome_def_hash: def.hash,
    }));
    const dnaTemplate: DnaTemplate = {
      name: 'adf',
      zome_defs: zomeDefReferences,
    };

    const dnaTemplateHash = await this._compositoryService.publishDnaTemplate(
      dnaTemplate
    );

    const dnaFile = await bundleDna(
      this._compositoryService,
      dnaTemplateHash,
      '',
      {}
    );

    downloadFile(dnaFile);

    this._installDnaDialog.open();
  }

  render() {
    if (!this.zomeDefs)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    return html` <compository-install-dna-dialog
        id="install-dna-dialog"
      ></compository-install-dna-dialog>
      <div class="column">
        <mwc-list
          multi
          @selected=${(e: CustomEvent) =>
            (this._selectedIndexes = e.detail.index)}
        >
          ${this.zomeDefs.map(
            zomeDef => html`
              <mwc-check-list-item>${zomeDef.content.name}</mwc-check-list-item>
            `
          )}
        </mwc-list>

        <mwc-button
          label="CREATE DNA TEMPLATE"
          @click=${() => this.createDnaTemplate()}
        ></mwc-button>
      </div>`;
  }
}
