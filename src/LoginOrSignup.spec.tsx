import * as React from "react"
import { Feature } from "jest-then";
import { customRender } from "./testUtils"
import { LoginOrSignup, LoginOrSignupProps } from "./LoginOrSignup"
import { func, object, verify } from "testdouble"
import { ServicesContainer } from "./ServicesContext"




Feature( "User can switch tab", () => {
	test( `Calls "onClickSwitchTab" prop with tab to activate`, () => {
		const { click, props: { onClickSwitchTab } } = renderLoginOrSignup( { action: "login" } )
		
		click( /signup/i )
		verify( onClickSwitchTab( "signup" ) )
		
		// updateWrapperProps( { action: "signup" } )
		
		click( /login/i )
		verify( onClickSwitchTab( "login" ) )
	} )
} )


function renderLoginOrSignup( props: Partial<LoginOrSignupProps> = {} )
{
	const _props: LoginOrSignupProps = {
		onAuthSubmit:     func<LoginOrSignupProps["onAuthSubmit"]>(),
		onClickSwitchTab: func<LoginOrSignupProps["onClickSwitchTab"]>(),
		action:           "login",
		...props,
	}
	
	const wrapper = customRender( <LoginOrSignup {..._props}/>, object<ServicesContainer>() ) // @todo: remove that with a default
	
	return {
		...wrapper,
		props: _props,
	}
	
	// @todo: work on typescript default parameters setup
}


/*
xFeature( "Tabs are controlled by url", () => {
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
*/