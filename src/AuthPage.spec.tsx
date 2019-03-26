import * as React from "react"
import { Feature } from "jest-then"
import { AuthenticationPage, AuthenticationPageProps } from "./AuthPage"
import { NavigateFn, WindowLocation } from "@reach/router"
import { customRender } from "./testUtils"
import { LoginOrSignup, LoginOrSignupProps } from "./LoginOrSignup"
import { func, verify } from "testdouble"




jest.mock( "./LoginOrSignup" )

beforeEach( () => (LoginOrSignup as jest.Mock).mockReturnValue( null ) )

Feature( "Active tab is controlled by url", () => {
	test( `Url "action" query param is passed as "tab" prop`, () => {
		const location = { search: "?action=whatever" } as WindowLocation,
		      { view } = renderAuthPage( { location } )
		
		expect( view.tab ).toBe( "whatever" )
	} )
} )

Feature( "Switching tab updates url", () => {
	test( `Url is updated with clicked tab`, () => {
		const location                      = { search: "?action=signup" } as WindowLocation,
		      { view, props: { navigate } } = renderAuthPage( { location } )
		
		view.onClickSwitchTab( "login" )
		verify( navigate( "?action=login" ) )
		
		view.onClickSwitchTab( "signup" )
		verify( navigate( "?action=signup" ) )
	} )
	
} )


function renderAuthPage( props: Partial<AuthenticationPageProps> )
{
	const navigate = func<NavigateFn>()
	
	const wrapper = customRender( <AuthenticationPage {...props} navigate={navigate}/> )
	
	
	return {
		...wrapper,
		props: {
			...props,
			navigate,
		},
		get view(): LoginOrSignupProps
		{
			return [ ...(LoginOrSignup as jest.Mock).mock.calls ].last()[ 0 ] // first param of last call
		},
	}
}