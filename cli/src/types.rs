use holo_hash::WasmHash;
use holochain_types::dna::wasm::DnaWasm;
use holochain_serialized_bytes::prelude::*;

#[derive(Debug, Clone)]
pub struct ZomeWithCode {
    pub ui_bundle: Option<Vec<u8>>,
    pub wasm_code: DnaWasm,
    pub wasm_hash: WasmHash,
    pub entry_defs: Vec<String>, // Entry definition ID ordered by position in the zome
    pub required_properties: Vec<String>,
    pub required_membrane_proof: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, SerializedBytes)]
pub struct ZomeToPublish {
    pub wasm_file: String, // Hash of the uploaded file
    pub ui_bundle: Option<String>,
    pub wasm_hash: WasmHash,
    pub entry_defs: Vec<String>, // Entry definition ID ordered by position in the zome
    pub required_properties: Vec<String>,
    pub required_membrane_proof: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, SerializedBytes)]
pub struct TemplateDna {
    pub name: String,
    pub zomes: Vec<(String, String)>, // (Name, Hash)
}
