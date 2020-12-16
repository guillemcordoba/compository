import init, { compress_dna } from 'compress_dna';
import { CompositoryService } from '../services/compository-service';
import { ZomeDef } from '../types/dnas';

export async function bundleDna(
  compositoryService: CompositoryService,
  dnaTemplateHash: string,
  uuid: string,
  properties: any
): Promise<File> {
  await init();

  // Get the dna template
  const dnaTemplate = await compositoryService.getDnaTemplate(dnaTemplateHash);

  // Fetch all zomes for that template
  const promises = dnaTemplate.zome_defs.map(async zome_def =>
    fetchZome(compositoryService, zome_def.zome_def_hash)
  );
  const zomes = await Promise.all(promises);

  // Prepare the arguments
  const argZomes = zomes.map(zome => [
    zome.zomeDef.name,
    { wasm_hash: Array.from(zome.zomeDef.wasm_hash) },
  ]);
  const codesPromises = zomes.map(zome => zome.file.arrayBuffer());
  const codes = await Promise.all(codesPromises);

  // Compress the dna
  const contents = await compress_dna(
    dnaTemplate.name,
    uuid,
    properties,
    argZomes,
    codes.map(code => ({ code: Array.from(new Uint8Array(code)) }))
  );

  // Return the contents
  return new File([contents.buffer], 'new_dna.gz', {type: 'application/octet-stream'});
}

async function fetchZome(
  compositoryService: CompositoryService,
  zomeDefHash: string
): Promise<{ zomeDef: ZomeDef; file: File }> {
  const zomeDef = await compositoryService.getZomeDef(zomeDefHash);

  const file = await compositoryService.downloadFile(zomeDef.wasm_file);
  return { zomeDef, file };
}
