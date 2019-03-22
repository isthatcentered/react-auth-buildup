import * as React from "react"
import { HTMLAttributes, useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import { authCredentials, Gatekeeper } from "./Gatekeeper"
import { alertkind, LoginOrSignup } from "./LoginOrSignup"




export interface AuthPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	gatekeeper: Gatekeeper
}



export function AuthPage( { gatekeeper, navigate, location, style = {}, className = "", children, ...props }: AuthPageProps )
{
	const [ message, setMessage ] = useState<undefined | { type: alertkind, body: any }>( undefined )
	
	useEffect( () => {
		if ( gatekeeper.authenticated() )
			navigate!( "/" )
	} )
	
	
	function handleLogin( credentitals: authCredentials )
	{
		gatekeeper.login( credentitals )
			.then( () => setMessage( { type: "success", body: "Success" } ) )
			.then( () => navigate!( "/" ) )
	}
	
	
	function handleSignup( credentitals: authCredentials )
	{
		gatekeeper.signup( credentitals )
			.then( () => navigate!( "/" ) )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthPage flex items-center justify-center min-h-screen`}
		>
			<LoginOrSignup
				message={message}
				onLogin={handleLogin}
				onSignup={handleSignup}
			/>
		</div>)
}


