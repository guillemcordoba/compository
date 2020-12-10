import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { ScopedElementsHost } from '@open-wc/scoped-elements/types/src/types';
import { LitElement } from 'lit-element';
import { TemplateResult } from 'lit-html';

export type Dictionary<T> = { [key: string]: T };

export interface ScopedRenderers {
  standalone: Array<StandaloneRenderer>;
  // Key is the entry id
  entryRenderers: Dictionary<EntryRenderer>;
  entryAttachments: Array<AttachmentRenderer>;
}

export type SetupRenderers = (
  appWebsocket: AppWebsocket,
  cellId: CellId
) => Promise<ScopedRenderers>;

export interface Renderer {
  name: string;
}
export interface StandaloneRenderer extends Renderer {
  render: (host: LitElement & ScopedElementsHost) => void;
}

export interface EntryRenderer extends Renderer {
  render: (host: LitElement & ScopedElementsHost, entryHash: string) => void;
}

export interface AttachmentRenderer extends Renderer {
  render: (host: LitElement & ScopedElementsHost, entryHash: string) => void;
}
