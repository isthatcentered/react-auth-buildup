import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { authCredentials, Gatekeeper } from "./Gatekeeper"




const gatekeeper: Gatekeeper = {
	signup( credentials: authCredentials ): Promise<void>
	{
		return Promise.resolve()
	},
	login( credentials: authCredentials ): Promise<void>
	{
		return Promise.resolve()
	},
	authenticated(): boolean
	{
		return false
	},
}

ReactDOM.render( <App gatekeeper={gatekeeper}/>, document.getElementById( "root" ) );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
