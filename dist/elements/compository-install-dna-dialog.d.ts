import { LitElement } from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
import { Button } from '@material/mwc-button';
import { TextField } from '@material/mwc-textfield';
import { AdminWebsocket } from '@holochain/conductor-api';
declare const CompositoryInstallDnaDialog_base: typeof LitElement & import("lit-element").Constructor<import("scoped-element-mixin/dist/ScopedElementMixin").ScopedElement>;
export declare abstract class CompositoryInstallDnaDialog extends CompositoryInstallDnaDialog_base {
    _dialog: Dialog;
    _dnaPath: string;
    abstract _adminWebsocket: AdminWebsocket;
    get scopedElements(): {
        'mwc-dialog': typeof Dialog;
        'mwc-button': typeof Button;
        'mwc-textfield': typeof TextField;
    };
    open(opened?: boolean): void;
    installDna(): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
export {};
