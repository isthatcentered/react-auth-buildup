import { RouteComponentProps } from "@reach/router"
import * as React from "react"
import { FormEvent, HTMLAttributes, useContext, useEffect, useState } from "react"
import { ServicesContext } from "./ServicesContext"
import { Alert } from "./Random"
import { parse } from "query-string"




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


export interface LoginOrSignupProps extends HTMLAttributes<HTMLDivElement>
{
	action: "login" | "signup"
	onClickSwitchTab: ( tab: "login" | "signup" ) => void
	onAuthSubmit: ( type: "login" | "signup", credentials: credentials ) => Promise<void>
}


export function LoginOrSignup( { onClickSwitchTab, onAuthSubmit, action, style = {}, className = "", children, ...props }: LoginOrSignupProps )
{
	
	
	function handleSubmit( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		const data     = new FormData( e.target as HTMLFormElement ),
		      email    = data.get( "email" ) as string | undefined,
		      password = data.get( "password" ) as string | undefined
		
		if ( !email || !password )
			return
		
		onAuthSubmit( action, { email, password } )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginOrSignup`}
		>
			
			<button onClick={() => onClickSwitchTab( "login" )}>
				Login
			</button>
			
			<button onClick={() => onClickSwitchTab( "signup" )}>
				Signup
			</button>
			
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input type="email"
					       name="email"
					       placeholder="Email"/>
				</label>
				
				<label>
					Password
					<input type="password"
					       name="password"
					       placeholder="Password"/>
				</label>
				
				<button type="submit">
					{action === "signup" ?
					 "Sign me up" :
					 "Log me in"}
				</button>
			</form>
		</div>
	)
}
