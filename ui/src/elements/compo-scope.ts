import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { ScopedElementsHost } from '@open-wc/scoped-elements/types/src/types';
import { Constructor, html, LitElement } from 'lit-element';

export abstract class CompoScope extends (ScopedElementsMixin(
  LitElement
) as Constructor<LitElement & ScopedElementsHost>) {
  render() {
    return html`<slot></slot>`;
  }
}
