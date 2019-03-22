import * as React from "react"
import { HTMLAttributes, useEffect } from "react"
import { RouteComponentProps } from "@reach/router"
import { authCredentials, Gatekeeper } from "./Gatekeeper"
import { LoginOrSignup } from "./LoginOrSignup"




export interface AuthPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	gatekeeper: Gatekeeper
}


export function AuthPage( { gatekeeper, navigate, location, style = {}, className = "", children, ...props }: AuthPageProps )
{
	useEffect( () => {
		if ( gatekeeper.authenticated() )
			navigate!( "/" )
	} )
	
	
	function handleLogin( credentitals: authCredentials )
	{
		gatekeeper.login( credentitals )
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
				onLogin={handleLogin}
				onSignup={handleSignup}
			/>
		</div>)
}


