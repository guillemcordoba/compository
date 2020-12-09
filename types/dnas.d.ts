export interface DnaTemplate {
    name: string;
    zomes: Array<ZomeDefReference>;
}
export interface ZomeDefReference {
    name: string;
    zome_def_hash: string;
}
export interface ZomeDef {
    wasm_file: string;
    components_bundle_file: string | undefined;
    wasm_hash: string;
    entry_defs: Array<string>;
    required_properties: Array<string>;
    required_membrane_proof: boolean;
}
export interface EntryDefLocator {
    dnaHash: string;
    zomeIndex: number;
    entryDefIndex: number;
    entryHash: string;
}
