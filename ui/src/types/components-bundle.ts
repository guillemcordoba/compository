import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { TemplateResult } from 'lit-html';

export type Dictionary<T> = { [key: string]: T };

export interface ComponentDefinition {
  tag: string;
  component: HTMLElement;
}

export interface ComponentsBundle {
  component: Array<ComponentDefinition>;
  standalone: Array<() => TemplateResult>;
  entryRenderers: Dictionary<
    // Key is the entry id
    (entryHash: string, entryDetails: any) => TemplateResult
  >;
  entryAttachments: Array<(entryHash: string) => TemplateResult>;
}

export type SetupElements = (
  appWebsocket: AppWebsocket,
  cellId: CellId
) => Promise<ComponentsBundle>;
