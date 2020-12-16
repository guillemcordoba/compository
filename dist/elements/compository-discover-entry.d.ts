import { AdminWebsocket } from '@holochain/conductor-api';
import { LitElement, TemplateResult } from 'lit-element';
import { CompositoryScope } from './compository-scope';
import { CompositoryService } from '../services/compository-service';
export declare abstract class CompositoryDiscoverEntry extends LitElement {
    entryUri: string;
    abstract _compositoryService: CompositoryService;
    abstract _adminWebsocket: AdminWebsocket;
    _loading: boolean;
    _scope: CompositoryScope;
    firstUpdated(): Promise<void>;
    render(): TemplateResult;
}
