import * as React from "react"
import { Case, Feature, Then } from "jest-then"
import { AuthenticationPage, AuthenticationPageProps } from "./AuthPage"
import { NavigateFn, WindowLocation } from "@reach/router"
import { customRender } from "./testUtils"
import { LoginOrSignup, LoginOrSignupProps } from "./LoginOrSignup"
import { func, verify } from "testdouble"




jest.mock( "./LoginOrSignup" )

beforeEach( () => (LoginOrSignup as jest.Mock).mockReturnValue( null ) )

Feature( "Active tab is controlled by url", () => {
	Case( `No "action" query param in url`, () => {
		Then( "Login tab is shown by default", () => {
			const location = { search: "" } as WindowLocation,
			      { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "login" )
		} )
	} )
	
	Case( `Invalid tab`, () => {
		Then( "Login tab is shown", () => {
			const location = { search: "?action=__INVALID__" } as WindowLocation,
			      { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "login" )
		} )
	} )
	
	Case( `Valid tab set as active in url`, () => {
		test( "Login tab is shown", () => {
			const location = { search: "?action=login" } as WindowLocation,
			      { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "login" )
		} )
		
		test( "signup tab is shown", () => {
			const location = { search: "?action=signup" } as WindowLocation,
			      { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "signup" )
		} )
	} )
	
	Case( "User switches tab", () => {
		Then( `Url is updated with clicked tab`, () => {
			const location                      = { search: "?action=signup" } as WindowLocation,
			      { view, props: { navigate } } = renderAuthPage( { location } )
			
			view.onClickSwitchTab( "login" )
			verify( navigate( "?action=login" ) )
			
			view.onClickSwitchTab( "signup" )
			verify( navigate( "?action=signup" ) )
		} )
	} )
} )

Feature( "User can switch between login and signup tab", () => {
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