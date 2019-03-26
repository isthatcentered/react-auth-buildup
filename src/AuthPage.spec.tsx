import * as React from "react"
import { Case, Feature, Then } from "jest-then"
import { AuthenticationPage, AuthenticationPageProps } from "./AuthPage"
import { WindowLocation } from "@reach/router"
import { customRender } from "./testUtils"
import { LoginOrSignup, LoginOrSignupProps } from "./LoginOrSignup"




jest.mock( "./LoginOrSignup" )

beforeEach( () => (LoginOrSignup as jest.Mock).mockReturnValue( null ) )

Feature( "Active tab is controlled by url", () => {
	Case( `No "action" query param in url`, () => {
		Then( "Login tab is shown by default", () => {
			const location = { search: "" } as WindowLocation
			const { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "login" )
		} )
	} )
	
	Case( `Invalid tab`, () => {
		Then( "Login tab is shown", () => {
			const location = { search: "?action=__INVALID__" } as WindowLocation
			const { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "login" )
		} )
	} )
	
	Case( `Valid tab set as active in url`, () => {
		test( "Login tab is shown", () => {
			const location = { search: "?action=login" } as WindowLocation
			const { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "login" )
		} )
		
		test( "signup tab is shown", () => {
			const location = { search: "?action=signup" } as WindowLocation
			const { view } = renderAuthPage( { location } )
			
			expect( view.action ).toBe( "signup" )
		} )
	} )
} )



Feature( "User can switch between login and signup tabs", () => {



} )


function renderAuthPage( props: Partial<AuthenticationPageProps> )
{
	const wrapper = customRender( <AuthenticationPage location={props.location}/> )
	
	
	return {
		...wrapper,
		get view(): LoginOrSignupProps
		{
			return [ ...(LoginOrSignup as jest.Mock).mock.calls ].last()[ 0 ] // first param of last call
		},
	}
}