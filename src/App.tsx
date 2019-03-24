import * as React from "react"
import { HTMLAttributes } from "react"
import { Router } from "@reach/router"
import { HomePage } from "./HomePage"
import { AuthenticationPage } from "./AuthPage.spec"




export interface AppProps extends HTMLAttributes<HTMLDivElement>
{
}


export function App( { style = {}, className = "", children, ...props }: AppProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} App`}
		>
			<Router>
				<HomePage path="/"/>
				<AuthenticationPage path="/auth"/>
			</Router>
		</div>
	)
}

