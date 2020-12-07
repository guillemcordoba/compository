use std::convert::TryInto;

use crate::{
    conductor_api::{
        app_websocket::AppWebsocket,
        types::{ClientAppResponse, ClientZomeCall},
    },
    types::{TemplateDna, ZomeWithCode},
};
use anyhow::{anyhow, Result};
use hc_utils::WrappedEntryHash;
use holochain_types::cell::CellId;

mod file_upload;

pub async fn publish_template_dna(
    ws: &mut AppWebsocket,
    compository_cell_id: &CellId,
    dna_name: String,
    zomes: Vec<(String, ZomeWithCode)>,
) -> Result<String> {
    let names: Vec<String> = zomes.clone().into_iter().map(|z| z.0).collect();
    let zomes_codes = zomes.into_iter().map(|z| z.1).collect();

    let zomes_hashes = publish_zomes(ws, compository_cell_id, zomes_codes).await?;

    let zomes = names
        .into_iter()
        .enumerate()
        .map(|(index, n)| (n, zomes_hashes[index].clone()))
        .collect();

    let template_dna = TemplateDna {
        name: dna_name,
        zomes,
    };

    let zome_call = ClientZomeCall {
        cap: None,
        cell_id: compository_cell_id.clone(),
        fn_name: "publish_template_dna".into(),
        payload: template_dna.try_into()?,
        provenance: compository_cell_id.agent_pubkey().clone(),
        zome_name: "compository".into(),
    };

    let response = ws.call_zome(compository_cell_id, zome_call).await?;

    match response {
        ClientAppResponse::ZomeCallInvocation(bytes) => {
            let hash: WrappedEntryHash = bytes.try_into()?;
            let str_hash = format!("{}", hash.0);
            println!("Published template dna with hash {}", str_hash);

            Ok(str_hash)
        }
        _ => Err(anyhow!("Bad response")),
    }
}

pub async fn publish_zomes(
    ws: &mut AppWebsocket,
    compository_cell_id: &CellId,
    zomes: Vec<ZomeWithCode>,
) -> Result<Vec<String>> {
    let mut zomes_hashes: Vec<String> = vec![];

    for zome in zomes {
        let zome_hash = publish_zome(ws, compository_cell_id, zome).await?;

        zomes_hashes.push(zome_hash);
    }

    Ok(zomes_hashes)
}

async fn publish_zome(
    ws: &mut AppWebsocket,
    compository_cell_id: &CellId,
    zome: ZomeWithCode,
) -> Result<String> {
    let zome_to_publish = file_upload::upload_zome(ws, compository_cell_id, zome).await?;

    let zome_call = ClientZomeCall {
        cap: None,
        cell_id: compository_cell_id.clone(),
        fn_name: "publish_zome".into(),
        payload: zome_to_publish.try_into()?,
        provenance: compository_cell_id.agent_pubkey().clone(),
        zome_name: "compository".into(),
    };

    let response = ws.call_zome(compository_cell_id, zome_call).await?;

    match response {
        ClientAppResponse::ZomeCallInvocation(bytes) => {
            let hash: WrappedEntryHash = bytes.try_into()?;
            let str_hash = format!("{}", hash.0);

            println!("Published zome with hash {}", str_hash);

            Ok(str_hash)
        }
        _ => Err(anyhow!("Bad response")),
    }
}
