import { __decorate } from "tslib";
import { html, LitElement, property, query } from 'lit-element';
import { Scoped } from 'scoped-elements';
import { CompositoryService } from '../services/compository-service';
import { sharedStyles } from './sharedStyles';
import { Button } from '@material/mwc-button';
import { List } from '@material/mwc-list';
import { CheckListItem } from '@material/mwc-list/mwc-check-list-item';
import { CircularProgress } from '@material/mwc-circular-progress';
import { generateDna } from '../processes/generate-dna';
import { downloadFile } from '../processes/download-file';
import { CompositoryInstallDnaDialog } from './compository-install-dna-dialog';
import { withMembraneContext } from 'holochain-membrane-context';
export class CompositoryComposeZomes extends withMembraneContext(Scoped(LitElement)) {
    constructor() {
        super(...arguments);
        this._selectedIndexes = new Set();
    }
    static get styles() {
        return sharedStyles;
    }
    static get scopedElements() {
        return {
            'mwc-list': List,
            'mwc-check-list-item': CheckListItem,
            'mwc-circular-progress': CircularProgress,
            'mwc-button': Button,
            'compository-install-dna-dialog': CompositoryInstallDnaDialog,
        };
    }
    get _compositoryService() {
        return new CompositoryService(this.context.membrane.appWebsocket, this.context.membrane.cellId);
    }
    async firstUpdated() {
        this.zomeDefs = await this._compositoryService.getAllZomeDefs();
    }
    async createDnaTemplate() {
        const zomeDefs = Array.from(this._selectedIndexes).map(i => this.zomeDefs[i]);
        const zomeDefReferences = zomeDefs.map(def => ({
            name: def.content.name,
            zome_def_hash: def.hash,
        }));
        const dnaTemplate = {
            name: 'adf',
            zome_defs: zomeDefReferences,
        };
        const dnaTemplateHash = await this._compositoryService.publishDnaTemplate(dnaTemplate);
        const dnaFile = await generateDna(this._compositoryService, dnaTemplateHash, '', {});
        downloadFile(dnaFile);
        this._installDnaDialog.open();
    }
    render() {
        if (!this.zomeDefs)
            return html `<mwc-circular-progress></mwc-circular-progress>`;
        return html ` <compository-install-dna-dialog
        id="install-dna-dialog"
      ></compository-install-dna-dialog>
      <div class="column">
        <mwc-list
          multi
          @selected=${(e) => (this._selectedIndexes = e.detail.index)}
        >
          ${this.zomeDefs.map(zomeDef => html `
              <mwc-check-list-item>${zomeDef.content.name}</mwc-check-list-item>
            `)}
        </mwc-list>

        <mwc-button
          label="CREATE DNA TEMPLATE"
          @click=${() => this.createDnaTemplate()}
        ></mwc-button>
      </div>`;
    }
}
__decorate([
    property()
], CompositoryComposeZomes.prototype, "zomeDefs", void 0);
__decorate([
    query('#install-dna-dialog')
], CompositoryComposeZomes.prototype, "_installDnaDialog", void 0);
//# sourceMappingURL=compository-compose-zomes.js.map