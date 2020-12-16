import { LitElement } from 'lit-element';
import { CompositoryService } from '../services/compository-service';
import { Hashed, ZomeDef } from '../types/dnas';
import { Button } from '@material/mwc-button';
import { List } from '@material/mwc-list';
import { CheckListItem } from '@material/mwc-list/mwc-check-list-item';
import { CircularProgress } from '@material/mwc-circular-progress';
import { CompositoryInstallDnaDialog } from './compository-install-dna-dialog';
import { AdminWebsocket } from '@holochain/conductor-api';
declare const CompositoryComposeZomes_base: typeof LitElement & import("lit-element").Constructor<import("scoped-element-mixin/dist/ScopedElementMixin").ScopedElement>;
export declare abstract class CompositoryComposeZomes extends CompositoryComposeZomes_base {
    zomeDefs: Array<Hashed<ZomeDef>>;
    _installDnaDialog: CompositoryInstallDnaDialog;
    _selectedIndexes: Set<number>;
    abstract _compositoryService: CompositoryService;
    abstract _adminWebsocket: AdminWebsocket;
    static get styles(): import("lit-element").CSSResult;
    get scopedElements(): {
        'mwc-list': typeof List;
        'mwc-check-list-item': typeof CheckListItem;
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-button': typeof Button;
        'compository-install-dna-dialog': {
            new (): HTMLElement;
            prototype: HTMLElement;
        };
    };
    firstUpdated(): Promise<void>;
    createDnaTemplate(): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
export {};
