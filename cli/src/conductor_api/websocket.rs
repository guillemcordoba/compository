use anyhow::{anyhow, Context, Result};
use holochain::conductor::api::{AppRequest, AppResponse, ZomeCall};
use holochain_types::cell::CellId;
use holochain_websocket::{websocket_connect, WebsocketConfig, WebsocketSender};
use std::sync::Arc;
use tracing::{instrument, trace};
use url::Url;

#[derive(Clone)]
pub struct AppWebsocket {
    tx: WebsocketSender,
}

impl AppWebsocket {
    #[instrument(err)]
    pub async fn connect(url: String) -> Result<Self> {
        let url = Url::parse(&url).context("invalid ws:// URL")?;
        let websocket_config = Arc::new(WebsocketConfig::default());
        let (tx, _rx) = websocket_connect(url.clone().into(), websocket_config).await?;
        Ok(Self { tx })
    }

    #[instrument(skip(self), err)]
    pub async fn call_zome(&mut self, cell_id: &CellId, call: ZomeCall) -> Result<AppResponse> {
        self.send(AppRequest::ZomeCall(Box::from(call))).await
    }

    async fn send(&mut self, msg: AppRequest) -> Result<AppResponse> {
        let response = self
            .tx
            .request(msg)
            .await
            .context("failed to send message")?;
        match response {
            AppResponse::Error(error) => Err(anyhow!("error: {:?}", error)),
            _ => {
                trace!("send successful");
                Ok(response)
            }
        }
    }
}
