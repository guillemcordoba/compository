import { html, LitElement, property } from 'lit-element';
import { Scoped } from 'scoped-elements';
import { BlockyBlockBoard } from 'blocky';
import { CompositoryComposeZomes } from './compository-compose-zomes';
import { CellId } from '@holochain/conductor-api';
import { membraneContext } from 'holochain-membrane-context';

export class CompositoryApp extends membraneContext(Scoped(LitElement)) {
  @property({ type: Array })
  generatedCellIdToShow: CellId | undefined = undefined;

  static get scopedElements() {
    return {
      'compository-compose-zomes': CompositoryComposeZomes,
      'blocky-block-board': BlockyBlockBoard,
    };
  }

  onCellInstalled(e: CustomEvent) {
    this.generatedCellIdToShow = e.detail.cellId;
  }

  render() {
    return html`
      ${this.generatedCellIdToShow
        ? html`
            <blocky-block-board
              .cellId=${this.generatedCellIdToShow}
              .compositoryCellId=${this.cellId}
            ></blocky-block-board>
          `
        : html`
            <compository-compose-zomes
              @dna-installed=${(e: CustomEvent) => this.onCellInstalled(e)}
            ></compository-compose-zomes>
          `}
    `;
  }
}
