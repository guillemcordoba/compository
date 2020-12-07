use hc_utils::WrappedEntryHash;
use hdk3::prelude::*;
use holo_hash::WasmHash;

#[hdk_entry(id = "zome")]
pub struct Zome {
    wasm_file: WrappedEntryHash,
    ui_bundle_file: Option<WrappedEntryHash>,
    wasm_hash: WasmHash,
    entry_defs: Vec<String>,
    required_properties: Vec<String>, // TODO: change to map, with property types
    required_membrane_proof: bool,
}

#[hdk_extern]
pub fn publish_zome(zome: Zome) -> ExternResult<WrappedEntryHash> {
    create_entry(&zome)?;

    let zome_hash = hash_entry(&zome)?;

    Ok(WrappedEntryHash(zome_hash))
}
