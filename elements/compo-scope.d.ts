import { ScopedElementsHost } from '@open-wc/scoped-elements/types/src/types';
import { Constructor, LitElement, TemplateResult } from 'lit-element';
declare const CompoScope_base: Constructor<LitElement & ScopedElementsHost>;
export declare class CompoScope extends CompoScope_base {
    customElements: CustomElementRegistry;
    createRenderRoot(): ShadowRoot;
    render(): TemplateResult;
}
export {};
