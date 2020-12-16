import { AdminWebsocket, CellId } from '@holochain/conductor-api';
import { CompositoryService } from '../services/compository-service';
import { ScopedRenderers } from '../types/scoped-renderers';
import { EntryDefLocator, ZomeDef } from '../types/dnas';
export declare function discoverEntryDetails(adminWebsocket: AdminWebsocket, compositoryService: CompositoryService, entryUri: string): Promise<EntryDefLocator>;
export declare function discoverRenderers(compositoryService: CompositoryService, cellId: CellId, zomeIndex: number): Promise<{
    renderers: ScopedRenderers;
    def: ZomeDef;
}>;
