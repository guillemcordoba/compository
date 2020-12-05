extern crate holochain;

mod conductor_api;
mod dna_file;
use std::env;

use anyhow::{anyhow, Result};
use dna_file::{get_zomes, read_dna};
use tracing::instrument;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    run().await
}

#[instrument(err)]
async fn run() -> Result<()> {
    let dna_path = get_dna_path()?;

    let dna = read_dna(dna_path).await?;

    let zomes = get_zomes(dna)?;

    println!("{:?}", zomes);

    Ok(())
}

fn get_dna_path() -> Result<String> {
    let args: Vec<String> = env::args().collect();

    match args.get(1) {
        Some(arg) => Ok(arg.clone()),
        None => Err(anyhow!("Bad dna path")),
    }
}
