import { authenticationCredentials } from "./AuthenticationPage/AuthenticationForm"
import * as React from "react"
import { HTMLAttributes, useContext, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import { ContainerContext } from "./ServicesContainer"
import { LoginOrSignup, LogInOrSignupStateProps } from "./AuthenticationPage/LogInOrSignup"




export interface Gatekeeper
{
	login( credentials: authenticationCredentials ): Promise<void>
}

interface AuthenticatePageProps extends HTMLAttributes <HTMLDivElement>, RouteComponentProps
{

}


export function AuthenticatePage( { location, navigate, style = {}, className = "", children, ...props }: AuthenticatePageProps )
{
	const { gatekeeper }      = useContext( ContainerContext ),
	      [ state, setState ] = useState<LogInOrSignupStateProps>( {
		      loading: false,
		      alert:   undefined,
		      action:  "login",
	      } )
	
	
	function handleAuthenticate( type: "login" | "signup", credentials: authenticationCredentials )
	{
		setState( {
			loading: true,
			alert:   undefined,
			action:  "login",
		} )
		
		gatekeeper.login( credentials )
			.then( () => {
				setState( {
					loading: false,
					alert:   { type: "success", message: "Success, redirecting in ..." },
					action:  "login",
				} )
			} )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticatePage`}
		>
			<LoginOrSignup{...state} onAuthenticate={handleAuthenticate}/>
		</div>
	)
}