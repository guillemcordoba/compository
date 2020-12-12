import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { ScopedElementsHost } from '@open-wc/scoped-elements/types/src/types';
import {
  Constructor,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

export class CompoScope extends (ScopedElementsMixin(LitElement) as Constructor<
  LitElement & ScopedElementsHost
>) {
  customElements = new CustomElementRegistry();

  createRenderRoot() {
    return this.attachShadow({
      mode: 'open',
      customElements: this.customElements,
    } as any);
  }

  render() {
    return html``;
  }
}
