import * as React from "react"
import { And, Case, Feature, Given, Then, When } from "jest-then"
import { appRender, tick } from "./testUtils"
import { object, when } from "testdouble"
import { credentials, Gatekeeper } from "./AuthPage"
import { wait } from "react-testing-library";
import { LoginOrSignupProps } from "./LoginOrSignup"




const gatekeeper               = object<Gatekeeper>(),
      credentialz: credentials = { email: "user@email.com", password: "$password$" }

let page: ReturnType<typeof renderAuthPage>

Feature( `User is redirected to home if already logged in`, () => {
	
	Case( "Already logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( true ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		Then( "User is redirected to home", () => {
			expect( page.history.location.pathname ).toBe( "/" )
		} )
	} )
	
	Case( "Not logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		Then( "User is NOT redirected to home", () => {
			expect( page.history.location.pathname ).toContain( "/auth" )
		} )
	} )
} )

Feature.each( [ "login", "signup" ] as LoginOrSignupProps["tab"][] )
( `User can %s`, ( action ) => {
	Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
	
	Case( "Authorized", () => {
		Given( () => when( gatekeeper[ action ]( credentialz ) ).thenResolve() )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( () => page.switchTab( action ) )
		
		When( async () => await wait( () => page[ action ]( credentialz ) ) )
		
		Then( "User is redirected to home", async () => {
			expect( page.history.location.pathname ).toBe( "/" )
		} )
	} )
	
	Case( "Not authorized", () => {
		const error = { message: "Error from reject", name: "" }
		
		Given( () => when( gatekeeper[ action ]( credentialz ) ).thenReject( error ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( () => page.switchTab( action ) )
		
		When( async () => await wait( () => page[ action ]( credentialz ) ) )
		
		Then( "User stays on page", async () => {
			expect( page.history.location.pathname ).toBe( "/auth" )
		} )
		
		And( "User can see the error message", async () => {
			page.getByText( error.message )
		} )
	} )
} )

// @done: Find out how to test router route after navigate to enable true tab click in tests
// @done: Extract tab tests
// @done: Merge signup and login as table test case
// @done: remove "login" | "signup" duplication
// @todo: move alert back into login or signup (setError, setSucces as callback to onAuth ?)
// @todo: Re-evaluate design


function renderAuthPage( gatekeeper: Gatekeeper, { query }: { query: string } = { query: "" } )
{
	const wrapper = appRender( `/auth${query}`, { gatekeeper } )
	
	
	function fillCredentials( credentials: credentials )
	{
		wrapper.fill( /email/i, credentials.email )
		
		wrapper.fill( /password/i, credentials.password )
	}
	
	
	async function login( credentials: credentials )
	{
		fillCredentials( credentials )
		
		wrapper.submit( /log me in/i )
		
		await tick()
	}
	
	
	async function signup( credentials: credentials )
	{
		fillCredentials( credentials )
		
		wrapper.submit( /sign me up/i )
		
		await tick()
	}
	
	
	function switchTab( tab: "login" | "signup" ): void
	{
		wrapper.click( new RegExp( tab, "i" ) )
		
	}
	
	
	return {
		login,
		signup,
		switchTab,
		...wrapper,
	}
}
