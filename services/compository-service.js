import * as msgpack from '@msgpack/msgpack';
import { FileStorageService } from '@holochain-open-dev/file-storage';
export class CompositoryService extends FileStorageService {
    constructor(appWebsocket, compositoryCellId) {
        super(appWebsocket, compositoryCellId, 'file_storage');
        this.appWebsocket = appWebsocket;
        this.compositoryCellId = compositoryCellId;
    }
    async getTemplateForDna(dnaHash) {
        const result = await this.callZome('compository', 'get_template_for_dna', dnaHash);
        result.properties = msgpack.decode(result.properties);
        return result;
    }
    async getZomeDef(zomeDefHash) {
        return this.callZome('compository', 'get_zome_def', zomeDefHash);
    }
    callZome(zome, fnName, payload) {
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
//# sourceMappingURL=compository-service.js.map