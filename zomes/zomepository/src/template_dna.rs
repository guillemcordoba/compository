use hdk3::prelude::*;

#[hdk_entry(id = "template_dna")]
pub struct TemplateDna {
    zomes: Vec<EntryHash>, // TODO: change to map?
}

#[hdk_entry(id = "instantiated_dna")]
pub struct InstantiatedDna {
    template_dna: EntryHash,
    properties: Map<String, String>, // TODO: fix this
}
