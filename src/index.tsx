import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { ContainerContext, ServicesContainer } from "./ServicesContainer"
import { authenticationCredentials } from "./AuthenticationPage/AuthenticationForm"




const services: ServicesContainer = {
	gatekeeper: {
		login( credentials: authenticationCredentials ): Promise<void>
		{
			return Promise.resolve()
		},
	},
}

ReactDOM.render(
	<ContainerContext.Provider value={services}>
		<App/>
	</ContainerContext.Provider>,
	document.getElementById( "root" ),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

