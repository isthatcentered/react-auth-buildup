import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { ServicesContainer, ServicesContext } from "./ServicesContext";
import { credentials } from "./AuthPage"




const services: ServicesContainer = {
	gatekeeper: {
		login( credentials: credentials ): Promise<void>
		{
			return Promise.resolve()
		},
		signup( credentials: credentials ): Promise<void>
		{
			return Promise.resolve()
		},
		isAuthenticated(): boolean
		{
			return false
		},
	},
}
ReactDOM.render(
	<ServicesContext.Provider value={services}>
		<App/>
	</ServicesContext.Provider>,
	document.getElementById( "root" ),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

