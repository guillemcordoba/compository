mod zome;
mod template_dna;


/*

1. Receive <HASH_OF_DNA>://<HASH_OF_ENTRY>
2. Fetch instantiated dna with hash_of_dna
3. Fetch all zomes from template dna and install dna // TODO: what about other companion dnas??
4. Fetch entry with header from newly instantiated dna, get the zome index and entry index
5. Fetch correct bundle from zome entry, and get the string id of the entry type
6. Invoke the appropriate custom element with the hash/element

Configurable pieces for the future
- Link form
- How to get the element from the entry hash
- Dna wide UIs for more specificity
- Multiple and configurable zomepositories

*/