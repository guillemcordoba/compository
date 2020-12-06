use std::collections::BTreeMap;

use anyhow::{anyhow, Result};
use holochain::core::ribosome::{
    guest_callback::entry_defs::{EntryDefsHostAccess, EntryDefsInvocation, EntryDefsResult},
    real_ribosome::RealRibosome,
    RibosomeT,
};
use holochain_serialized_bytes::prelude::*;
use holochain_types::{
    dna::zome::WasmZome,
    dna::{wasm::DnaWasm, DnaDef, DnaFile},
    prelude::SerializedBytes,
};
use holochain_zome_types::{entry_def::EntryDefs, zome::ZomeName};
use std::convert::TryInto;

pub async fn read_dna(dna_work_dir: &impl AsRef<std::path::Path>) -> Result<DnaFile> {
    let dna_work_dir = dna_work_dir.as_ref().canonicalize()?;
    let mut json_filename = dna_work_dir.clone();
    json_filename.push("dna.json");

    let json_data = tokio::fs::read(json_filename.clone()).await?;

    let json_file: DnaDefJson = serde_json::from_slice(&json_data)?;

    let dna_file_content = json_file.compile_dna_file(&dna_work_dir).await?;

    Ok(dna_file_content)
}

pub fn get_entry_defs(dna_file: DnaFile) -> Result<BTreeMap<ZomeName, EntryDefs>> {
    let ribosome = RealRibosome::new(dna_file);
    
    let entry_defs = ribosome.run_entry_defs(EntryDefsHostAccess, EntryDefsInvocation)?;

    match entry_defs {
        EntryDefsResult::Defs(defs) => Ok(defs),
        EntryDefsResult::Err(_, __) => Err(anyhow!("Could not get entry defs")),
    }
}

#[derive(Debug, Clone)]
pub struct Zome {
    wasm_code: DnaWasm,
    entry_defs: EntryDefs,
}

pub fn get_zomes(dna_file: DnaFile) -> Result<Vec<(String, Zome)>> {
    let (dna_def, _): (DnaDef, Vec<DnaWasm>) = dna_file.clone().into();
    let dna_code = dna_file.code().clone();

    let entry_defs = get_entry_defs(dna_file)?;

    let mut zomes: Vec<(String, Zome)> = vec![];

    for (zome_name, zome_entry_defs) in entry_defs.into_iter() {
        let wasm_zome = dna_def.get_wasm_zome(&zome_name)?;

        let wasm_code = dna_code
            .get(&wasm_zome.wasm_hash)
            .ok_or(anyhow!("Bad dna file"))?;

        zomes.push((
            zome_name.0,
            Zome {
                wasm_code: wasm_code.clone(),
                entry_defs: zome_entry_defs,
            },
        ));
    }

    Ok(zomes)
}

/*
  input -> workdir/dna.json
  dna_util::compile_dna_file to get the entry defs
  get all zomes with code and publish them
  publish a template_dna
  Configuration options
*/

/// See `holochain_types::dna::zome::Zome`.
/// This is a helper to convert to json.
#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct ZomeJson {
    pub wasm_path: String,
    pub ui_path: Option<String>,
}

/// Special Json Value Decode Helper
#[derive(Debug, serde::Serialize, serde::Deserialize, SerializedBytes)]
struct JsonValueDecodeHelper(pub serde_json::Value);

/// See `holochain_types::dna::DnaDef`.
/// This is a helper to convert to json.
#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct DnaDefJson {
    pub name: String,
    pub uuid: String,
    pub properties: serde_json::Value,
    pub zomes: BTreeMap<ZomeName, ZomeJson>,
    pub ui_path: Option<String>,
}

impl DnaDefJson {
    pub async fn compile_dna_file(
        &self,
        work_dir: impl Into<std::path::PathBuf>,
    ) -> Result<DnaFile> {
        let work_dir = work_dir.into();

        let properties: SerializedBytes =
            JsonValueDecodeHelper(self.properties.clone()).try_into()?;

        let mut zomes = Vec::new();
        let mut wasm_list = Vec::new();

        for (zome_name, zome) in self.zomes.iter() {
            let mut zome_file_path = work_dir.clone();
            zome_file_path.push(&zome.wasm_path);

            let zome_content = tokio::fs::read(zome_file_path).await?;

            let wasm: DnaWasm = zome_content.into();
            let wasm_hash = holo_hash::WasmHash::with_data(&wasm).await;
            zomes.push((zome_name.clone(), WasmZome { wasm_hash }.into()));
            wasm_list.push(wasm);
        }

        let dna = DnaDef {
            name: self.name.clone(),
            uuid: self.uuid.clone(),
            properties,
            zomes,
        };

        Ok(DnaFile::new(dna, wasm_list).await?)
    }
}