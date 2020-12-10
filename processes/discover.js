import { CompositoryService } from '../services/compository-service';
import { serializeHash } from '@holochain-open-dev/common';
import { installDna } from './install-dna';
import { importModuleFromFile } from './import-module-from-file';
async function fetchZomeAndEntryIndexes(appWebsocket, cellId, entryHash) {
    const details = await appWebsocket.callZome({
        cap: null,
        cell_id: cellId,
        provenance: cellId[1],
        zome_name: 'common',
        fn_name: 'get_entry_details',
        payload: entryHash,
    });
    const header = details.headers[0].header;
    const create = header.content;
    const appEntryType = create.entry_type.App;
    return {
        cellId,
        zomeIndex: appEntryType.zome_id,
        entryDefIndex: appEntryType.id,
        entryHash,
    };
}
export async function discoverEntryDetails(adminWebsocket, appWebsocket, compositoryCellId, entryUri) {
    const compositoryService = new CompositoryService(appWebsocket, compositoryCellId);
    // For now only <DNA_HASH>://<ENTRY_HASH>
    const [dnaHash, entryHash] = entryUri.split('://');
    // Find the cellId corresponding to the given dna
    const cellIds = await adminWebsocket.listCellIds();
    let cellId = cellIds.find(cellId => serializeHash(cellId[0]) === dnaHash);
    // If we don't have the dna installed, install it
    if (!cellId) {
        cellId = await installDna(adminWebsocket, compositoryService, dnaHash);
    }
    // Fetch information about the entry from its header
    return fetchZomeAndEntryIndexes(appWebsocket, cellId, entryHash);
}
export async function discoverRenderers(appWebsocket, compositoryCellId, cellId, zomeIndex) {
    const compositoryService = new CompositoryService(appWebsocket, compositoryCellId);
    const dnaHash = serializeHash(cellId[0]);
    const template = await compositoryService.getTemplateForDna(dnaHash);
    const zomeDefHash = template.dnaTemplate.zome_defs[zomeIndex].zome_def_hash;
    // Fetch the appropriate elements bundle for this zome
    const zomeDef = await compositoryService.getZomeDef(zomeDefHash);
    if (!zomeDef.components_bundle_file)
        throw new Error('This zome does not have any elements bundle file');
    const file = await compositoryService.downloadFile(zomeDef.components_bundle_file);
    const module = await importModuleFromFile(file);
    const renderers = await module.default(appWebsocket, cellId);
    return {
        renderers,
        def: zomeDef,
    };
}
//# sourceMappingURL=discover.js.map