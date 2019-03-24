import * as React from "react"
import { FormEvent, HTMLAttributes, useContext, useEffect } from "react"

import { Case, Feature, Given, Then } from "jest-then"
import { appRender, tick } from "./testUtils"
import { RouteComponentProps } from "@reach/router"
import { object, verify, when } from "testdouble"
import { ServicesContext } from "./ServicesContext"




export interface credentials
{
	email: string
	password: string
}


export interface Gatekeeper
{
	isAuthenticated(): boolean;
	
	login( credentials: credentials ): Promise<void>
}


export interface AuthenticationPageProps extends RouteComponentProps, HTMLAttributes<HTMLDivElement>
{
}


export function AuthenticationPage( { navigate, style = {}, className = "", children, ...props }: AuthenticationPageProps )
{
	const { gatekeeper } = useContext( ServicesContext )
	
	useEffect( () => {
		if ( gatekeeper.isAuthenticated() )
			navigate!( "/" )
	} )
	
	
	function handleSubmit( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		const data     = new FormData( e.target as HTMLFormElement ),
		      email    = data.get( "email" ) as string | undefined,
		      password = data.get( "password" ) as string | undefined
		
		if ( !email || !password )
			return
		
		gatekeeper.login( { email, password } )
			.then( () => navigate!( "/" ) )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPage`}
		>
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
				
				<button type="submit">Log me in</button>
			</form>
		</div>
	)
}


Feature( `User is redirected to home if already logged in`, () => {
	const gatekeeper = object<Gatekeeper>()
	
	Case( "Already logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( true ) )
		
		Then( "User is redirected to home", () => {
			const { navigate } = appRender( "/auth", { gatekeeper } )
			
			verify( navigate( "/", undefined ) )
		} )
	} )
	
	Case( "Not logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
		
		Then( "User is redirected to home", () => {
			const { navigate } = appRender( "/auth", { gatekeeper } )
			
			verify( navigate( "/", undefined ), { times: 0 } )
		} )
	} )
} )

Feature( `User can log in`, () => {
	const gatekeeper               = object<Gatekeeper>(),
	      credentials: credentials = { email: "user@email.com", password: "$password$" }
	
	Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
	
	Case( "Authorized", () => {
		
		Given( () => when( gatekeeper.login( credentials ) ).thenResolve() )
		
		when( () => {
		
		} )
		
		Then( "User is redirected to home", async () => {
			const { navigate, fill, click, submit } = appRender( "/auth", { gatekeeper } )
			
			fill( /email/i, credentials.email )
			
			fill( /password/i, credentials.password )
			
			click( /log me in/i )
			
			await tick()
			
			verify( navigate( "/", undefined ) )
		} )
	} )
	
	Case( "Not authorized", () => {
		// Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
		//
		// Then( "User gets an alert", () => {
		// 	const { navigate } = appRender( "/auth", { gatekeeper } )
		//
		// 	verify( navigate( "/", undefined ), { times: 0 } )
		// } )
		//
		// And( "User is not redirected", () => {
		//
		// } )
	} )
} )

// I can login
// I get redirected to home
