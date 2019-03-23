import * as React from "react"
import { and, feature, given, scenario, then, when as When } from "jest-then";
import { appRender } from "./testUtils"
import { authenticationCredentials } from "./AuthenticationPage/AuthenticationForm"
import { object, verify, when } from "testdouble"
import { Gatekeeper } from "./AuthenticationPage"



// jest.mock( "./random" )
// import { Burron } from "./random"
//
//
//
//
// expect( button ).lastWith( "" )
// jest.clearAllMocks()


const fakeGatekeeper = object<Gatekeeper>()
let page: authPageRender
feature( `User can log in`, () => {
	scenario( `Success`, () => {
		const credentials: authenticationCredentials = { email: "user@email.com", password: "$password$" }
		
		given( () => jest.useFakeTimers() )
		
		given( () => when( fakeGatekeeper.login( credentials ) ).thenResolve() )
		
		given( () => page = renderAuthPage() )
		
		When( () => page.login( credentials ) )
		
		then( `A success message is displayed`, () => {
			page.getByText( /Success, redirecting in/i )
		} )
		
		and( `Success message counts down the number of seconds left before redirecting`, () => {
			page.getByText( /redirecting in 3/i )
			
			jest.advanceTimersByTime( 1000 )
			
			page.getByText( /redirecting in 2/i )
			
			jest.advanceTimersByTime( 1000 )
			
			page.getByText( /redirecting in 1/i )
		} )
		
		and( `User is redirected to home after a short delay`, () => {
			jest.advanceTimersByTime( 3000 )
			
			verify( page.navigate( "/", undefined ) )
		} )
		
		// form submit disabled check belongs to component
		// message countdown is a separate thing
		// form submit should be disabled
	} )
} )


interface authPageRender extends Pick<appRender, "getByText" | "navigate">
{
	login( credentials: authenticationCredentials ): void
}


function renderAuthPage(): authPageRender
{
	const wrapper = appRender( "/auth", { gatekeeper: fakeGatekeeper } )
	
	
	function login( credentials: authenticationCredentials )
	{
		wrapper.fill( /email/i, credentials.email )
		
		wrapper.fill( /password/i, credentials.password )
		
		wrapper.click( /Log me in/i )
	}
	
	
	return {
		login,
		...wrapper,
	}
}


feature( `User can sign up`, () => {

} )

feature( `Guard`, () => {
// @todo: yolo object that returns "objectname.property" when asked for a get
} )
