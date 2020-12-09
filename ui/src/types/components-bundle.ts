import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { Constructor } from 'lit-element';
import { TemplateResult } from 'lit-html';

export type Dictionary<T> = { [key: string]: T };

export interface ComponentsBundle {
  components: Dictionary<Constructor<HTMLElement>>;
  standalone: Array<StandaloneRenderer>;
  // Key is the entry id
  entryRenderers: Dictionary<EntryRenderer>;
  entryAttachments: Array<AttachmentRenderer>;
}

export type SetupComponents = (
  appWebsocket: AppWebsocket,
  cellId: CellId
) => Promise<ComponentsBundle>;

export interface Renderer {
  name: string;
}
export interface StandaloneRenderer extends Renderer {
  render: () => TemplateResult;
}

export interface EntryRenderer extends Renderer {
  render: (entryHash: string) => TemplateResult;
}

export interface AttachmentRenderer extends Renderer {
  render: (entryHash: string) => TemplateResult;
}
