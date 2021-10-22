import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./history";
import config from "./auth_config.json"

const onRedirectCallback = appState => {
	history.push(
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};


ReactDOM.render(
	<Auth0Provider
		domain={config.domain}
		clientId={config.clientId}
		redirectUri={window.location.origin}
		onRedirectCallback={onRedirectCallback}>
		<App />
	</Auth0Provider>,
	document.getElementById("root")
	);

