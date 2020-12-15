import { html, LitElement, property, query } from 'lit-element';
import { Scoped } from 'scoped-element-mixin';
import { Dialog } from '@material/mwc-dialog';
import { Button } from '@material/mwc-button';
import { TextField } from '@material/mwc-textfield';
import { AdminWebsocket } from '@holochain/conductor-api';

export abstract class CompositoryInstallDnaDialog extends Scoped(LitElement) {
  @query('#dialog')
  _dialog!: Dialog;

  @property({ type: String })
  _dnaPath!: string;

  abstract _adminWebsocket: AdminWebsocket;

  get scopedElements() {
    return {
      'mwc-dialog': Dialog,
      'mwc-button': Button,
      'mwc-textfield': TextField,
    };
  }
  open(opened: boolean = true) {
    this._dialog.open = opened;
  }

  async installDna() {
    const agentKey = await this._adminWebsocket.generateAgentPubKey();
    const result = await this._adminWebsocket.installApp({
      agent_key: agentKey,
      dnas: [{ nick: '', path: this._dnaPath }],
      installed_app_id: `generated-app-${Date.now() % 1000}`,
    });

    this.dispatchEvent(
      new CustomEvent('dna-installed', {
        detail: { cellId: result.cell_data[0][0] },
      })
    );
    this.open(false);
  }

  render() {
    return html`
      <mwc-dialog id="dialog" heading="Install new DNA">
        <mwc-textfield
          id="dna-path"
          placeholder="Dna.gz path"
          required
          @input=${(e: any) => (this._dnaPath = e.target.value)}
        >
        </mwc-textfield>

        <mwc-button
          slot="primaryAction"
          .disabled=${!this._dnaPath}
          @click=${() => this.installDna()}
        >
          Install
        </mwc-button>
        <mwc-button slot="secondaryAction" dialogAction="cancel">
          Cancel
        </mwc-button>
      </mwc-dialog>
    `;
  }
}
