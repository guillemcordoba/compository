import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { CompositoryService } from '../services/compository-service';
import { serializeHash, HolochainCoreTypes } from '@holochain-open-dev/common';
import { installDna } from './install-dna';
import { ComponentsBundle } from '../types/components-bundle';
import { importModuleFromFile } from './import-module-from-file';
import { EntryDefLocator, ZomeDef } from '../types/dnas';

async function fetchZomeAndEntryIndexes(
  appWebsocket: AppWebsocket,
  cellId: CellId,
  entryHash: string
): Promise<EntryDefLocator> {
  const details: HolochainCoreTypes.EntryDetails = await appWebsocket.callZome({
    cap: null,
    cell_id: cellId,
    provenance: cellId[1],
    zome_name: 'common',
    fn_name: 'get_entry_details',
    payload: entryHash,
  });

  const header = details.headers[0].header;

  const create = header.content as HolochainCoreTypes.Create;

  const appEntryType = (create.entry_type as {
    App: HolochainCoreTypes.AppEntryType;
  }).App;

  return {
    dnaHash: serializeHash(cellId[0]),
    zomeIndex: appEntryType.zome_id,
    entryDefIndex: appEntryType.id,
    entryHash,
  };
}

export async function discoverEntryDetails(
  adminWebsocket: AdminWebsocket,
  appWebsocket: AppWebsocket,
  compositoryCellId: CellId,
  entryUri: string
): Promise<EntryDefLocator> {
  const compositoryService = new CompositoryService(
    appWebsocket,
    compositoryCellId
  );

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

export async function discoverComponentsBundle(
  appWebsocket: AppWebsocket,
  compositoryCellId: CellId,
  dnaHash: string,
  zomeIndex: number
): Promise<{ bundle: ComponentsBundle; def: ZomeDef }> {
  const compositoryService = new CompositoryService(
    appWebsocket,
    compositoryCellId
  );

  const template = await compositoryService.getTemplateForDna(dnaHash);

  const zomeDefHash = template.dnaTemplate.zome_defs[zomeIndex].zome_def_hash;

  // Fetch the appropriate elements bundle for this zome
  const zomeDef = await compositoryService.getZomeDef(zomeDefHash);

  if (!zomeDef.components_bundle_file)
    throw new Error('This zome does not have any elements bundle file');

  const file = await compositoryService.downloadFile(
    zomeDef.components_bundle_file
  );

  const module = await importModuleFromFile(file);
  return {
    bundle: module as ComponentsBundle,
    def: zomeDef,
  };
}
