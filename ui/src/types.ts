import { AppWebsocket } from '@holochain/conductor-api';

export type Dictionary<T> = { [key: string]: T };

export interface Elements {
  standalone: Dictionary<HTMLElement>;
  entryRenderers: Dictionary<EntryRendererElement<any>>;
  entryAttachments: Dictionary<EntryAttachmentElement>;
}

export interface EntryRendererElement<T> extends HTMLElement {
  entry: T;
}

export interface EntryAttachmentElement extends HTMLElement {
  entryHash: string;
}

export type SetupElements = (appWebsocket: AppWebsocket) => Promise<Elements>;
