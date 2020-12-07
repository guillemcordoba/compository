use holochain_serialized_bytes::prelude::*;
use std::{convert::TryInto, time::SystemTime};

use anyhow::{anyhow, Result};
use hc_utils::WrappedEntryHash;
use holochain_types::cell::CellId;
use holochain_zome_types::timestamp;

use crate::{
    conductor_api::{
        app_websocket::AppWebsocket,
        types::{ClientAppResponse, ClientZomeCall},
    },
    types::{ZomeToPublish, ZomeWithCode},
};

const CHUNKS_SIZE: usize = 1024 * 1024 * 10;

pub async fn upload_zome(
    ws: &mut AppWebsocket,
    compository_cell_id: &CellId,
    zome: ZomeWithCode,
) -> Result<ZomeToPublish> {
    let size = zome.wasm_code.code.len();
    let chunk_iter = zome.wasm_code.code.chunks(CHUNKS_SIZE);

    let mut chunk_hashes: Vec<String> = vec![];

    for chunk in chunk_iter {
        let hash = upload_chunk(ws, &compository_cell_id, chunk).await?;

        chunk_hashes.push(hash);
    }

    let file_hash = create_file(ws, &compository_cell_id, size, chunk_hashes).await?;

    let zome_to_publish = ZomeToPublish {
        entry_defs: zome.entry_defs,
        required_membrane_proof: zome.required_membrane_proof,
        required_properties: zome.required_properties,
        wasm_file: file_hash,
        wasm_hash: zome.wasm_hash,
    };

    Ok(zome_to_publish)
}

#[derive(Debug, Clone, Serialize, Deserialize, SerializedBytes)]
struct Chunk(Vec<u8>);

async fn upload_chunk(
    ws: &mut AppWebsocket,
    compository_cell_id: &CellId,
    code: &[u8],
) -> Result<String> {
    let zome_call = ClientZomeCall {
        cap: None,
        cell_id: compository_cell_id.clone(),
        fn_name: "create_file_chunk".into(),
        payload: Chunk(code.to_vec()).try_into()?,
        provenance: compository_cell_id.agent_pubkey().clone(),
        zome_name: "file_storage".into(),
    };
    let response = ws.call_zome(compository_cell_id, zome_call).await?;

    match response {
        ClientAppResponse::ZomeCallInvocation(bytes) => {
            let hash: WrappedEntryHash = bytes.try_into()?;

            Ok(format!("{}", hash.0))
        }
        _ => Err(anyhow!("Bad response")),
    }
}

#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct CreateFileMetadataInput {
    pub name: String,
    pub last_modified: timestamp::Timestamp,
    pub size: usize,
    pub file_type: String,
    pub chunks_hashes: Vec<String>,
}

async fn create_file(
    ws: &mut AppWebsocket,
    compository_cell_id: &CellId,
    size: usize,
    chunks_hashes: Vec<String>,
) -> Result<String> {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(SystemTime::UNIX_EPOCH)?;

    let timestamp = timestamp::Timestamp(
        since_the_epoch.as_secs() as i64,
        since_the_epoch.subsec_nanos(),
    );

    let payload = CreateFileMetadataInput {
        name: "test.wasm".into(),
        last_modified: timestamp,
        size,
        chunks_hashes,
        file_type: "wasm".into(),
    };

    let zome_call = ClientZomeCall {
        cap: None,
        cell_id: compository_cell_id.clone(),
        fn_name: "create_file_metadata".into(),
        payload: payload.try_into()?,
        provenance: compository_cell_id.agent_pubkey().clone(),
        zome_name: "file_storage".into(),
    };

    let response = ws.call_zome(compository_cell_id, zome_call).await?;

    match response {
        ClientAppResponse::ZomeCallInvocation(bytes) => {
            let hash: WrappedEntryHash = bytes.try_into()?;

            Ok(format!("{}", hash.0))
        }
        _ => Err(anyhow!("Bad response")),
    }
}
