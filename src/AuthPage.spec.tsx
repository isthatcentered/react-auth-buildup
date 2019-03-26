import * as React from "react"
import { And, Case, Feature, Given, Scenario, Then, When } from "jest-then"
import { appRender, tick } from "./testUtils"
import { object, when } from "testdouble"
import { credentials, Gatekeeper } from "./AuthPage"
import { wait } from "react-testing-library";




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

Feature( `User can log in`, () => {
	
	Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
	
	Case( "Authorized", () => {
		
		Given( () => when( gatekeeper.login( credentialz ) ).thenResolve() )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( async () => await page.login( credentialz ) )
		
		Then( "User is redirected to home", async () => {
			expect( page.history.location.pathname ).toBe( "/" )
		} )
	} )
	
	Case( "Not authorized", () => {
		const error = { message: "Error from reject", name: "" }
		
		Given( () => when( gatekeeper.login( credentialz ) ).thenReject( error ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( async () => await page.login( credentialz ) )
		
		Then( "User stays on page", async () => {
			expect( page.history.location.pathname ).toBe( "/auth" )
		} )
		
		And( "User can see the error message", async () => {
			page.getByText( error.message )
		} )
	} )
} )

Feature( "User can sign-up", () => {
	Case( "Authorized", () => {
		
		Given( () => when( gatekeeper.signup( credentialz ) ).thenResolve() )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( () => page.switchTab( "signup" ) )
		
		When( async () => await wait( () => page.signup( credentialz ) ) )
		
		Then( "User is redirected to home", async () => {
			expect( page.history.location.pathname ).toBe( "/" )
		} )
	} )
	
	Case( "Registration error", () => {
		const error = { message: "Error from reject", name: "" }
		
		Given( () => when( gatekeeper.signup( credentialz ) ).thenReject( error ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( () => page.switchTab( "signup" ) )
		
		When( async () => await wait( () => page.signup( credentialz ) ) )
		
		Then( "User stays on page", async () => {
			expect( page.history.location.pathname ).toBe( "/auth" )
		} )
		
		And( "User can see the error message", async () => {
			page.getByText( error.message )
		} )
	} )
} )

Feature( "Tabs are controlled by url", () => {
	Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
	
	Scenario( "Login tab specified in url", () => {
		Given( () => page = renderAuthPage( gatekeeper, { query: "?action=login" } ) )
		
		Then( `Login tab is active`, () => {
			page.getByText( /log me in/i )
		} )
		
		
		And( `Sign up tab is not visible`, () => {
			expect( () => page.getByText( /Sign me up/i ) ).toThrow()
		} )
	} )
	
	Scenario( "Signup tab specified in url", () => {
		Given( () => page = renderAuthPage( gatekeeper, { query: "?action=signup" } ) )
		
		Then( `Sign up tab is active`, () => {
			page.getByText( /Sign me up/i )
		} )
		
		And( `Login tab is not visible`, () => {
			expect( () => page.getByText( /Log me in/i ) ).toThrow()
		} )
	} )
	
	Scenario( "No tab specified in url", () => {
		
		Given( () => page = renderAuthPage( gatekeeper, { query: "" } ) )
		
		Then( `Login tab is active by default`, () => {
			page.getByText( /log me in/i )
		} )
	} )
	
	Scenario( "Triggering a tab switch updates url", () => {
		
		Given( () => page = renderAuthPage( gatekeeper, { query: "" } ) )
		
		Then( "Correct tab is set via url", async () => {
			page.click( /signup/i )
			
			expect( page.history.location ).toMatchObject( {
				pathname: "/auth",
				search:   "action=signup",
			} )
			
			page.click( /login/i )
			
			expect( page.history.location ).toMatchObject( {
				pathname: "/auth",
				search:   "action=login",
			} )
		} )
	} )
} )

// @done: Find out how to test router route after navigate to enable true tab click in tests
// @todo: Extract tab tests
// @todo: move alert back into login or signup (setError, setSucces as callback to onAuth ?)
// @todo: Add new integration test to ensure active tab comes from url
// @todo: Merge signup and login as table test case
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
