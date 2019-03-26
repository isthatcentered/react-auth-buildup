import * as React from "react"
import { Feature } from "jest-then";
import { customRender } from "./testUtils"
import { LoginOrSignup, LoginOrSignupProps } from "./LoginOrSignup"
import { func, verify } from "testdouble"




Feature( "Login tab is active by default", () => {
	test( `Invalid param`, () => {
		const { getByText } = renderLoginOrSignup( { tab: "__INVALID__" as any } )
		getByText( /log me in/i )
	} )
} )


Feature( "User can switch tab", () => {
	test( `Calls "onClickSwitchTab" prop with tab to activate`, () => {
		const { click, props: { onClickSwitchTab } } = renderLoginOrSignup( { tab: "login" } )
		
		click( /signup/i )
		verify( onClickSwitchTab( "signup" ) )
		
		click( /login/i )
		verify( onClickSwitchTab( "login" ) )
	} )
} )



function renderLoginOrSignup( props: Partial<LoginOrSignupProps> = {} )
{
	const _props: LoginOrSignupProps = {
		onAuthSubmit:     func<LoginOrSignupProps["onAuthSubmit"]>(),
		onClickSwitchTab: func<LoginOrSignupProps["onClickSwitchTab"]>(),
		tab:              "login",
		...props,
	}
	
	const wrapper = customRender( <LoginOrSignup {..._props}/> )
	
	return {
		...wrapper,
		props: _props,
	}
}

