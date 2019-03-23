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
					alert:   { type: "success", message: "Success, redirecting in 3" },
					action:  "login",
				} )
				
				
				let count = 3
				
				const messageInterval = setInterval( () => {
					count = count - 1
					
					setState( {
						loading: false,
						alert:   { type: "success", message: `Success, redirecting in ${count}` },
						action:  "login",
					} )
				}, 1000 )
				
				setTimeout( () => {
					console.log( "CALLED" )
					clearInterval( messageInterval )
					navigate!( "/" )
				}, 3000 )
			} )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticatePage flex items-center justify-center min-h-screen`}
		>
			<LoginOrSignup{...state} onAuthenticate={handleAuthenticate}/>
		</div>
	)
}