import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { ScopedRenderers } from '../types/scoped-renderers';
import { EntryDefLocator, ZomeDef } from '../types/dnas';
export declare function discoverEntryDetails(adminWebsocket: AdminWebsocket, appWebsocket: AppWebsocket, compositoryCellId: CellId, entryUri: string): Promise<EntryDefLocator>;
export declare function discoverRenderers(appWebsocket: AppWebsocket, compositoryCellId: CellId, cellId: CellId, zomeIndex: number): Promise<{
    renderers: ScopedRenderers;
    def: ZomeDef;
}>;
