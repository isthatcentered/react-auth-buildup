import * as React from "react"
import { FormEvent, HTMLAttributes, useContext, useEffect, useState } from "react"

import { And, Case, Feature, Given, Scenario, Then, When } from "jest-then"
import { appRender, tick } from "./testUtils"
import { RouteComponentProps } from "@reach/router"
import { object, verify, when } from "testdouble"
import { ServicesContext } from "./ServicesContext"
import { Alert } from "./Random"




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
	const { gatekeeper }      = useContext( ServicesContext ),
	      [ alert, setAlert ] = useState<string | undefined>( undefined )
	
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
			.catch( ( err: Error ) => setAlert( err.message ) )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPage`}
		>
			
			{alert && <Alert type="error">{alert}</Alert>}
			
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


const gatekeeper               = object<Gatekeeper>(),
      credentials: credentials = { email: "user@email.com", password: "$password$" }

let page: ReturnType<typeof renderAuthPage>

Feature( `User is redirected to home if already logged in`, () => {
	
	Case( "Already logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( true ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		Then( "User is redirected to home", () => {
			verify( page.navigate( "/", undefined ) )
		} )
	} )
	
	Case( "Not logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		Then( "User is redirected to home", () => {
			verify( page.navigate( "/", undefined ), { times: 0 } )
		} )
	} )
} )

Feature( `User can log in`, () => {
	
	Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
	
	Case( "Authorized", () => {
		
		Given( () => when( gatekeeper.login( credentials ) ).thenResolve() )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( async () => await page.login( credentials ) )
		
		Then( "User is redirected to home", async () => {
			verify( page.navigate( "/", undefined ) )
		} )
	} )
	
	Case( "Not authorized", () => {
		const error = { message: "Error from reject", name: "" }
		
		Given( () => when( gatekeeper.login( credentials ) ).thenReject( error ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( async () => await page.login( credentials ) )
		
		Then( "User stays on page", async () => {
			verify( page.navigate( "/", undefined ), { times: 0 } )
		} )
		
		And( "User can see the error message", async () => {
			page.getByText( error.message )
		} )
	} )
} )

Feature( "Tabs are controlled by url", () => {
	Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
	
	Scenario( "No tab specified in url", () => {
		Given( () => page = renderAuthPage( gatekeeper, { query: "" } ) )
		
		Then( `Login tab is active by default`, () => {
			page.getByText( /log me in/i )
		} )
	} )
	
	Scenario( "Login tab specified in url", () => {
		Given( () => page = renderAuthPage( gatekeeper, { query: "?action=login" } ) )
		
		Then( `Login tab is active by default`, () => {
			page.getByText( /log me in/i )
		} )
	} )
} )

// Feature( "User can sign-up", () => {
// 	Case( "Authorized", () => {
//
// 		Given( () => when( gatekeeper.login( credentials ) ).thenResolve() )
//
// 		Given( () => page = renderAuthPage( gatekeeper ) )
//
// 		When( () => {
// 			// page.switchTab( "signup" )
// 		} )
//
// 		When( async () => await page.login( credentials ) )
//
// 		Then( "User is redirected to home", async () => {
// 			verify( page.navigate( "/", undefined ) )
// 		} )
// 	} )
//
// 	Case( "Registration error", () => {
//
// 	} )
// } )


function renderAuthPage( gatekeeper: Gatekeeper, { query }: { query: string } = { query: "" } )
{
	const wrapper = appRender( `/auth${query}`, { gatekeeper } )
	
	
	async function login( credentials: credentials )
	{
		wrapper.fill( /email/i, credentials.email )
		
		wrapper.fill( /password/i, credentials.password )
		
		wrapper.submit( /log me in/i )
		
		await tick()
	}
	
	
	return {
		login,
		...wrapper,
	}
}
