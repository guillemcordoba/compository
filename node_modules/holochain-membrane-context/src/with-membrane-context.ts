import { AdminWebsocket, AppWebsocket, CellId } from '@holochain/conductor-api';
import { Constructor } from 'lit-element';
import { withContext } from 'wc-context';

export interface MembraneContext {
  cellId: CellId;
  appWebsocket: AppWebsocket;
  adminWebsocket: AdminWebsocket;
}

export const withMembraneContext = <T extends Constructor<HTMLElement>>(
  baseClass: T
): T & Constructor<{ context: { membrane: MembraneContext } }> =>
  (class extends withContext(baseClass) {
    static get observedContexts() {
      return ['membrane'];
    }
  } as unknown) as T & Constructor<{ context: { membrane: MembraneContext } }>;
