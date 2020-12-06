use hdk3::prelude::*;

#[hdk_entry(id = "template_dna")]
pub struct TemplateDna {
    name: String,
    zomes: Vec<(String, EntryHash)>, // TODO: change to map?
}

// This goes as link tag from a dna path to the template dna
pub struct InstantiatedDna {
    uuid: String,
    properties: SerializedBytes, // TODO: fix this
}
