import * as React from "react"
import { HTMLAttributes } from "react"
import { Router } from "@reach/router"
import { Gatekeeper } from "./Gatekeeper"
import { AuthPage } from "./AuthenticationPage"
import { HomePage } from "./HomePage"




export interface AppProps extends HTMLAttributes<HTMLDivElement>
{
	gatekeeper: Gatekeeper
}


export function App( { gatekeeper, style = {}, className = "", children, ...props }: AppProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} App`}
		>
			<Router>
				<HomePage path="/"/>
				
				<AuthPage
					path="/authenticate"
					gatekeeper={gatekeeper}
				/>
			</Router>
		</div>
	)
}