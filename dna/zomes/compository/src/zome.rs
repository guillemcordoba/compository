use hdk3::prelude::*;

#[hdk_entry(id = "zome")]
pub struct Zome {
    wasm_file: EntryHash,
    properties: Vec<String>, // TODO: change to map,
    entry_definitions: Vec<String>
}
