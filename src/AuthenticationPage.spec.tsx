import * as React from "react"
import { feature, given, scenario } from "jest-then";
import { appRender, tick } from "./testUtils"
import { authenticationCredentials } from "./AuthenticationPage/AuthenticationForm"
import { object, when } from "testdouble"
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
feature( `User can log in`, () => {
	
	scenario( `Success`, () => {
		const credentials: authenticationCredentials = { email: "user@email.com", password: "$password$" }
		
		given( () => when( fakeGatekeeper.login( credentials ) ).thenResolve() )
		
		test( `I can log in`, async () => {
			const { login, getByText } = renderAuthPage()
			
			login( credentials )
			
			await tick()
			
			getByText( /Success, redirecting/i )
		} )
		
		// form submit should be disabled
		
		// message should be updated until redirect
		
		// sends success message
		
		// redirects after x
	} )
} )


function renderAuthPage()
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
