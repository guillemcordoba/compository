import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { ComponentsBundle } from '../types/components-bundle';
import { EntryDefLocator, ZomeDef } from '../types/dnas';
export declare function discoverEntryDetails(adminWebsocket: AdminWebsocket, appWebsocket: AppWebsocket, compositoryCellId: CellId, entryUri: string): Promise<EntryDefLocator>;
export declare function discoverComponentsBundle(appWebsocket: AppWebsocket, compositoryCellId: CellId, dnaHash: string, zomeIndex: number): Promise<{
    bundle: ComponentsBundle;
    def: ZomeDef;
}>;
