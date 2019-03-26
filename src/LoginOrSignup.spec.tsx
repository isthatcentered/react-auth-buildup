import * as React from "react"
import { Feature } from "jest-then";
import { customRender } from "./testUtils"
import { LoginOrSignup, LoginOrSignupProps } from "./LoginOrSignup"
import { func, verify } from "testdouble"




Feature( "User can switch tab", () => {
	test( `Calls "onClickSwitchTab" prop with tab to activate`, () => {
		const { click, props: { onClickSwitchTab } } = renderLoginOrSignup( { action: "login" } )
		
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
		action:           "login",
		...props,
	}
	
	const wrapper = customRender( <LoginOrSignup {..._props}/> )
	
	return {
		...wrapper,
		props: _props,
	}
}

