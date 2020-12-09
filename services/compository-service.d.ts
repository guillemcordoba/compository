import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { FileStorageService } from '@holochain-open-dev/file-storage';
import { DnaTemplate, ZomeDef } from '../types/dnas';
export interface GetTemplateForDnaOutput {
    dnaTemplate: DnaTemplate;
    properties: any;
    uuid: string;
}
export declare class CompositoryService extends FileStorageService {
    protected appWebsocket: AppWebsocket;
    protected compositoryCellId: CellId;
    constructor(appWebsocket: AppWebsocket, compositoryCellId: CellId);
    getTemplateForDna(dnaHash: string): Promise<GetTemplateForDnaOutput>;
    getZomeDef(zomeDefHash: string): Promise<ZomeDef>;
    private callZome;
}
