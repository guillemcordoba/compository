use std::collections::BTreeMap;

use anyhow::{anyhow, Result};
use holochain::core::ribosome::{
    guest_callback::entry_defs::{EntryDefsHostAccess, EntryDefsInvocation, EntryDefsResult},
    real_ribosome::RealRibosome,
    RibosomeT,
};
use holochain_types::dna::{wasm::DnaWasm, DnaDef, DnaFile};
use holochain_zome_types::{entry_def::EntryDefs, zome::ZomeName};

pub async fn read_dna(dna_path: String) -> Result<DnaFile> {
    println!("{:?}", dna_path);
    let dna_content = tokio::fs::read(dna_path).await?;
    let dna = DnaFile::from_file_content(&dna_content).await?;

    Ok(dna)
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
