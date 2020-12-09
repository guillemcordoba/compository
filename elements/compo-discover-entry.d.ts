import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { TemplateResult } from 'lit-element';
import { CircularProgressBase } from '@material/mwc-circular-progress/mwc-circular-progress-base';
declare const CompoDiscoverEntry_base: any;
export declare abstract class CompoDiscoverEntry extends CompoDiscoverEntry_base {
    #private;
    static get scopedElements(): {
        'mwc-circular-progress': typeof CircularProgressBase;
    };
    entryUri: string;
    compositoryCellId: CellId;
    abstract _appWebsocket: AppWebsocket;
    abstract _adminWebsocket: AdminWebsocket;
    firstUpdated(): Promise<void>;
    render(): TemplateResult;
}
export {};
