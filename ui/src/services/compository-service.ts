import { AppWebsocket, CellId } from '@holochain/conductor-api';
import * as msgpack from '@msgpack/msgpack';
import { FileStorageService } from '@holochain-open-dev/file-storage';
import { DnaTemplate, ZomeDef } from '../types/dnas';

export interface GetTemplateForDnaOutput {
  dnaTemplate: DnaTemplate;
  properties: any;
  uuid: string;
}

export class CompositoryService extends FileStorageService {
  constructor(
    protected appWebsocket: AppWebsocket,
    protected compositoryCellId: CellId
  ) {
    super(appWebsocket, compositoryCellId, 'file_storage');
  }

  async getTemplateForDna(dnaHash: string): Promise<GetTemplateForDnaOutput> {
    const result = await this.callZome(
      'compository',
      'get_template_for_dna',
      dnaHash
    );
    result.properties = msgpack.decode(result.properties);
    return result;
  }

  async getZomeDef(zomeDefHash: string): Promise<ZomeDef> {
    return this.callZome('compository', 'get_zome_def', zomeDefHash);
  }

  private callZome(zome: string, fnName: string, payload: any) {
    return this.appWebsocket.callZome({
      cap: null,
      cell_id: this.compositoryCellId,
      fn_name: fnName,
      payload: payload,
      provenance: this.compositoryCellId[1],
      zome_name: zome,
    });
  }
}
