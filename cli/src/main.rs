use structopt::StructOpt;

mod conductor_api;
mod dna_file;

use anyhow::Result;
use dna_file::{get_zomes, read_dna};
use tracing::instrument;

#[derive(Debug, StructOpt)]
#[structopt(name = "compository-publish")]
struct Opt {
    #[structopt(short = "d", long)]
    dna: Option<std::path::PathBuf>,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    run().await
}

#[instrument(err)]
async fn run() -> Result<()> {
    let opt = Opt::from_args();

    if let Some(work_dir) = opt.dna {
        let dna = read_dna(&work_dir).await?;

        let zomes = get_zomes(dna)?;

        println!("{:?}", zomes);
    }

    Ok(())
}
