use hdk3::prelude::*;

#[hdk_entry(id = "zome")]
pub struct Zome {
    wasm_hash: WasmHash,
    wasm_file: EntryHash,
    entry_defs: Vec<String>,
    properties: Vec<String>, // TODO: change to map, with property types
    membrane_proof_required: bool
}
