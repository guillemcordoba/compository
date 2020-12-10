import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { ScopedElementsHost } from '@open-wc/scoped-elements/types/src/types';
import { LitElement } from 'lit-element';
export declare type Dictionary<T> = {
    [key: string]: T;
};
export interface ScopedRenderers {
    standalone: Array<StandaloneRenderer>;
    entryRenderers: Dictionary<EntryRenderer>;
    entryAttachments: Array<AttachmentRenderer>;
}
export declare type SetupRenderers = (appWebsocket: AppWebsocket, cellId: CellId) => Promise<ScopedRenderers>;
export interface Renderer {
    name: string;
}
export interface StandaloneRenderer extends Renderer {
    render: (host: ScopeHost) => void;
}
export interface EntryRenderer extends Renderer {
    render: (host: ScopeHost, entryHash: string) => void;
}
export interface AttachmentRenderer extends Renderer {
    render: (host: ScopeHost, entryHash: string) => void;
}
export declare type ScopeHost = LitElement & ScopedElementsHost;
