import { Constructor } from "lit-element";
import "scoped-registries";

export type Dictionary<T> = { [key: string]: T };

declare global {
  interface HTMLElement {
    connectedCallback?(): void;
  }
}

export interface ScopedElement extends HTMLElement {
  readonly scopedElements: Dictionary<typeof HTMLElement>;
  shadowRoot: ShadowRoot & { customElements: CustomElementRegistry };
}

export const Scoped = <T extends Constructor<HTMLElement>>(
  baseClass: T
): T & Constructor<ScopedElement> =>
  class extends baseClass {
    shadowRoot!: ShadowRoot & { customElements: CustomElementRegistry };

    get scopedElements(): Dictionary<typeof HTMLElement> {
      return {};
    }

    createRenderRoot() {
      return this.attachShadow({
        mode: "open",
        customElements: new CustomElementRegistry(),
      } as any);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      const elements = this.scopedElements;

      for (const tag of Object.keys(elements)) {
        this.shadowRoot.customElements.define(tag, elements[tag]);
      }
    }
  };
