import * as React from "react"
import { And, Case, Feature, Given, Scenario, Then, When } from "jest-then"
import { appRender, tick } from "./testUtils"
import { object, verify, when } from "testdouble"
import { credentials, Gatekeeper } from "./AuthPage"




const gatekeeper               = object<Gatekeeper>(),
      credentialz: credentials = { email: "user@email.com", password: "$password$" }

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
		
		Given( () => when( gatekeeper.login( credentialz ) ).thenResolve() )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( async () => await page.login( credentialz ) )
		
		Then( "User is redirected to home", async () => {
			verify( page.navigate( "/", undefined ) )
		} )
	} )
	
	Case( "Not authorized", () => {
		const error = { message: "Error from reject", name: "" }
		
		Given( () => when( gatekeeper.login( credentialz ) ).thenReject( error ) )
		
		Given( () => page = renderAuthPage( gatekeeper ) )
		
		When( async () => await page.login( credentialz ) )
		
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
		
		Then( "Correct tab is set via url", () => {
			page.click( /signup/i )
			
			verify( page.navigate( "/auth?action=signup", undefined ) )
			
			page.click( /login/i )
			
			verify( page.navigate( "/auth?action=login", undefined ) )
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
