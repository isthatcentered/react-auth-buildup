import { RouteComponentProps } from "@reach/router"
import * as React from "react"
import { HTMLAttributes, useContext, useEffect, useState } from "react"
import { ServicesContext } from "./ServicesContext"
import { Alert } from "./Random"
import { parse } from "query-string"
import { LoginOrSignup } from "./LoginOrSignup"




export interface credentials
{
	email: string
	password: string
}

export interface Gatekeeper
{
	isAuthenticated(): boolean;
	
	login( credentials: credentials ): Promise<void>
	
	signup( credentials: credentials ): Promise<void>
}

export interface AuthenticationPageProps extends RouteComponentProps, HTMLAttributes<HTMLDivElement>
{
}


export function AuthenticationPage( { navigate, location, style = {}, className = "", children, ...props }: AuthenticationPageProps )
{
	const { gatekeeper }                                       = useContext( ServicesContext ),
	      [ alert, setAlert ]                                  = useState<string | undefined>( undefined ),
	      { action = "login" }: { action: "login" | "signup" } = parse( location!.search ) as any
	
	
	useEffect( () => {
		if ( gatekeeper.isAuthenticated() )
			navigate!( "/" )
	} )
	
	
	function handleSubmit( action: "login" | "signup", credentials: credentials )
	{
		return gatekeeper[ action ]( credentials )
			.then( () => navigate!( "/" ) )
			.catch( ( err: Error ) => setAlert( err.message ) )
	}
	
	
	function handleSwitchTab( action: "login" | "signup" ): void
	{
		navigate!( `?action=${action}` )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPage`}
		>
			{alert && <Alert type="error">{alert}</Alert>}
			
			<LoginOrSignup
				onClickSwitchTab={handleSwitchTab}
				onAuthSubmit={handleSubmit}
				action={action}
			/>
		</div>
	)
}


