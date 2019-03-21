import * as React from "react"
import { customRender } from "./AuthenticationPage.spec"
import { AuthenticationForm } from "./AuthenticationForm"
import { func, matchers, verify } from "testdouble"
import { authCredentials } from "./Gatekeeper"




test( `Calls "onSubmit" prop with email and passwor`, () => {
	const onAuth                               = func<any>(),
	      { email, password }: authCredentials = {
		      email:    "user@email.com",
		      password: "password$",
	      },
	      { fill, click }                      = customRender( <AuthenticationForm
		      cta="Submit"
		      onAuthenticate={onAuth}
	      /> )
	
	fill( /email/i, email )
	fill( /password/i, password )
	click( /submit/i )
	
	verify( onAuth( { email, password } ) )
} )

test( `Cannot submit if one the fields is empty`, () => {
	const onAuth          = func<any>(),
	      { fill, click } = customRender( <AuthenticationForm
		      cta="Submit"
		      onAuthenticate={onAuth}
	      /> )
	
	fill( /email/i, "email" )
	fill( /password/i, "" )
	
	click( /submit/i )
	
	verify( onAuth( matchers.anything() ), { times: 0 } )
	
	fill( /email/i, "" )
	fill( /password/i, "password" )
	
	click( /submit/i )
	
	verify( onAuth( matchers.anything() ), { times: 0 } )
} )