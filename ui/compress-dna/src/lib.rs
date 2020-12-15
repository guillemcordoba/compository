mod types;
mod utils;

use std::convert::TryInto;

use holo_hash::{HasHash, WasmHash};
use holochain_zome_types::zome::ZomeName;
use js_sys::Uint8Array;
use serde::{Deserialize, Serialize};
use types::dna::{
    wasm::{self, DnaWasmHashed},
    zome::ZomeDef,
    DnaDef, DnaError, DnaFile,
};
use wasm::DnaWasm;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Serialize, Deserialize)]
#[repr(transparent)]
pub struct NamedZomes(Vec<(ZomeName, ZomeDef)>);
#[derive(Serialize, Deserialize)]
#[repr(transparent)]
pub struct ZomeCodes(Vec<wasm::DnaWasm>);

#[wasm_bindgen]
pub async fn compress_dna(
    name: String,
    uuid: String,
    properties: JsValue,
    zomes: JsValue,
    wasms: JsValue,
) -> js_sys::Promise {
    future_to_promise(internal_compress_dna(name, uuid, properties, zomes, wasms))
}

async fn internal_compress_dna(
    name: String,
    uuid: String,
    properties: JsValue,
    zomes: JsValue,
    wasms: JsValue,
) -> Result<JsValue, JsValue> {
    let szomes: NamedZomes = zomes.into_serde().map_err(|e| {
        JsValue::from_str(format!("Failed to convert named zomes {:?}", e).as_str())
    })?;
    let swasms: ZomeCodes = wasms.into_serde().map_err(|e| {
        JsValue::from_str(format!("Failed to convert code {:?} {:?}", e, wasms).as_str())
    })?;

    for (index, zome) in szomes.0.iter().enumerate() {
        let computed_hash = WasmHash::with_data(&swasms.0[index]).await;

        if !computed_hash.eq(&zome.1.wasm_hash) {
            return Err(JsValue::from_str(
                "Hash of the zome code doesn't match the received wasm hash",
            ));
        }
    }

    let dna_def = DnaDef {
        name,
        properties: ().try_into().or(Err(JsValue::from_str("Failed to convert props")))?,
        uuid,
        zomes: szomes.0,
    };

    let file = DnaFile::new(dna_def, swasms.0)
        .await
        .or(Err(JsValue::from_str("Failed to build DnaFile")))?;

    let contents = file.to_file_content().await.or(Err(JsValue::from_str(
        "Failed to compile the dna file to contents",
    )))?;

    let array: Uint8Array = contents.as_slice().into();

    Ok(JsValue::from(array))
}
