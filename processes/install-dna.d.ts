import { AdminWebsocket, CellId } from '@holochain/conductor-api';
import { CompositoryService } from '../services/compository-service';
export declare function installDna(adminWebsocket: AdminWebsocket, compositoryService: CompositoryService, dnaHash: string): Promise<CellId>;
