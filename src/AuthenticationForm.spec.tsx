import * as React from "react"
import { customRender } from "./AuthenticationPage.spec"
import { AuthenticationForm } from "./AuthenticationForm"
import { func, matchers, verify } from "testdouble"
import { authCredentials } from "./Gatekeeper"




describe( `<AuthenticationForm/>`, () => {
	test( `Calls "onSubmit" prop with email and passwor`, () => {
		const credentials: authCredentials                   = {
			      email:    "user@email.com",
			      password: "password$",
		      },
		      { fillInCredentialsAndSubmit, onAuthCallback } = renderAuthForm()
		
		fillInCredentialsAndSubmit( credentials )
		
		verify( onAuthCallback( credentials ) )
	} )
	
	test( `Cannot submit if one the fields is empty`, () => {
		const EMPTY: string                                  = "",
		      { fillInCredentialsAndSubmit, onAuthCallback } = renderAuthForm()
		
		fillInCredentialsAndSubmit( { email: "email", password: EMPTY } )
		
		verify( onAuthCallback( matchers.anything() ), { times: 0 } )
		
		fillInCredentialsAndSubmit( { email: EMPTY, password: "password" } )
		
		verify( onAuthCallback( matchers.anything() ), { times: 0 } )
	} )
} )


function renderAuthForm()
{
	const onAuthCallback = func<any>(),
	      cta: string    = "Submit"
	
	const wrapper = customRender( <AuthenticationForm
		cta={cta}
		onAuthenticate={onAuthCallback}
	/> )
	
	
	function fillInCredentialsAndSubmit( { email, password }: authCredentials )
	{
		wrapper.fill( /email/i, email )
		
		wrapper.fill( /password/i, password )
		
		wrapper.click( new RegExp( cta ) )
	}
	
	return {
		...wrapper,
		onAuthCallback,
		fillInCredentialsAndSubmit,
	}
}

