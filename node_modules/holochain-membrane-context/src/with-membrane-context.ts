import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { Constructor, LitElement, property } from 'lit-element';
import { ConsumerMixin } from 'lit-element-context';

export interface MembraneContext {
  cellId: CellId;
  appWebsocket: AppWebsocket;
  adminWebsocket?: AdminWebsocket;
}

const membraneContextRaw = <T extends Constructor<HTMLElement>>(
  baseClass: T
): T & Constructor<{ holochainMembraneContext: MembraneContext }> =>
  (class extends ConsumerMixin(baseClass) {
    static get inject() {
      return ['holochainMembraneContext'];
    }
  } as unknown) as T &
    Constructor<{ holochainMembraneContext: MembraneContext }>;

export const membraneContext = <T extends Constructor<LitElement>>(
  baseClass: T
): T & Constructor<MembraneContext> => {
  class MembraneContextElement extends membraneContextRaw(baseClass) {
    @property({type: Object})
    holochainMembraneContext!: MembraneContext;

    private _cellId!: CellId;
    set cellId(value: CellId) {
      this.requestUpdate('cellId', this._cellId);
      this._cellId = value;
    }

    get cellId() {
      return this._cellId ? this._cellId : this.holochainMembraneContext.cellId;
    }

    private _appWebsocket!: AppWebsocket;
    set appWebsocket(value: AppWebsocket) {
      this.requestUpdate('appWebsocket', this._appWebsocket);
      this._appWebsocket = value;
    }

    get appWebsocket() {
      return this._appWebsocket
        ? this._appWebsocket
        : this.holochainMembraneContext.appWebsocket;
    }

    private _adminWebsocket: AdminWebsocket | undefined = undefined;
    set adminWebsocket(value: AdminWebsocket | undefined) {
      this.requestUpdate('adminWebsocket', this._adminWebsocket);
      this._adminWebsocket = value;
    }

    get adminWebsocket(): AdminWebsocket | undefined {
      return this._adminWebsocket
        ? this._adminWebsocket
        : this.holochainMembraneContext.adminWebsocket;
    }
  }
  return MembraneContextElement;
};
