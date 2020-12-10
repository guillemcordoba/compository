import { AdminWebsocket, AppWebsocket } from '@holochain/conductor-api';
import { TemplateResult } from 'lit-element';
import { CircularProgress } from '@material/mwc-circular-progress';
import { CompoScope } from './compo-scope';
declare const CompoDiscoverEntry_base: any;
export declare abstract class CompoDiscoverEntry extends CompoDiscoverEntry_base {
    static get scopedElements(): {
        'mwc-circular-progress': typeof CircularProgress;
        'compo-scope': typeof CompoScope;
    };
    entryUri: string;
    compositoryCellId: [string, string];
    abstract _appWebsocket: AppWebsocket;
    abstract _adminWebsocket: AdminWebsocket;
    _loading: boolean;
    _scope: CompoScope;
    firstUpdated(): Promise<void>;
    render(): TemplateResult;
}
export {};
