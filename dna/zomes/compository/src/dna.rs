use hc_utils::{WrappedDnaHash, WrappedEntryHash};
use hdk3::prelude::*;

#[hdk_entry(id = "template_dna")]
pub struct TemplateDna {
    name: String,
    zomes: Vec<(String, WrappedEntryHash)>,
}

// This goes as link tag from a dna path to the template dna
#[derive(Serialize, SerializedBytes, Deserialize, Clone)]
pub struct InstantiatedDnaTag {
    uuid: String,
    properties: SerializedBytes, // TODO: fix this
}

#[derive(Serialize, SerializedBytes, Deserialize, Clone)]
pub struct PublishInstantiatedDnaInput {
    template_dna_hash: WrappedEntryHash,
    instantiated_dna_hash: WrappedDnaHash,
    uuid: String,
    properties: SerializedBytes, // TODO: fix this
}

#[hdk_extern]
pub fn publish_template_dna(template_dna: TemplateDna) -> ExternResult<WrappedEntryHash> {
    create_entry(&template_dna)?;

    let hash = hash_entry(&template_dna)?;

    Ok(WrappedEntryHash(hash))
}

#[hdk_extern]
pub fn publish_instantiated_dna(input: PublishInstantiatedDnaInput) -> ExternResult<()> {
    let path = path_for_dna(input.instantiated_dna_hash);

    path.ensure()?;

    let tag = InstantiatedDnaTag {
        uuid: input.uuid,
        properties: input.properties,
    };
    let tag_bytes: SerializedBytes = tag.try_into()?;
    create_link(
        path.hash()?,
        input.template_dna_hash.0,
        tag_bytes.bytes().clone(),
    )?;

    Ok(())
}

fn path_for_dna(dna_hash: WrappedDnaHash) -> Path {
    Path::from(format!("all_instantiated_dnas.{}", dna_hash.0))
}
