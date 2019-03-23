import * as React from "react"
import { scenario } from "jest-then"
import { customRender } from "./testUtils"
import { authenticationCredentials, AuthenticationForm, AuthenticationFormProps } from "./AuthenticationPage/AuthenticationForm"
import { func, matchers, verify } from "testdouble"




scenario( `Processing`, () => {
	test( `Button is disabled`, () => {
		const { submitButton } = renderAuthForm( { processing: true } )
		
		expect( submitButton ).toHaveAttribute( "disabled" )
	} )
} )

describe( `On submit`, () => {
	scenario( `All fields filled`, () =>
		test( `Passes data to "onAuthenticate" prop`, () => {
			const { login, onAuthenticate }              = renderAuthForm(),
			      credentials: authenticationCredentials = {
				      email:    "user@email.com",
				      password: "$password$",
			      }
			
			login( credentials )
			
			verify( onAuthenticate( credentials ), { times: 1 } )
		} ) )
	
	scenario( `Any field empty`, () =>
		test( `Doesn"t call "onAuthenticate" prop if a field is missing`, () => {
			const { login, onAuthenticate } = renderAuthForm(),
			      EMPTY                     = ""
			
			login( { password: EMPTY, email: "not@empty.com" } )
			
			verify( onAuthenticate( matchers.anything() ), { times: 0 } )
		} ) )
} )


function renderAuthForm( props: Partial<AuthenticationFormProps> = {} )
{
	const onAuthenticate             = func<any>(),
	      { click, fill, getByText } = customRender(
		      <AuthenticationForm
			      processing={false}
			      onAuthenticate={onAuthenticate}
			      cta="submit"
			      {...props}
		      /> )
	
	const submitButton = getByText( /submit/i )
	
	const login = ( { email, password }: authenticationCredentials ) => {
		fill( /email/i, email )
		
		fill( /password/i, password )
		
		click( /submit/i )
	}
	
	return {
		onAuthenticate,
		submitButton,
		login,
	}
}