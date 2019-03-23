import * as React from "react"
import { HTMLAttributes } from "react"
import { feature, given, scenario } from "jest-then";
import { appRender } from "./testUtils"
import { RouteComponentProps } from "@reach/router"
import { authenticationCredentials } from "./AuthenticationPage/AuthenticationForm"
import { LoginOrSignup } from "./AuthenticationPage/LogInOrSignup"
import { object } from "testdouble"



// jest.mock( "./random" )
// import { Burron } from "./random"
//
//
//
//
// expect( button ).lastWith( "" )
// jest.clearAllMocks()

interface AuthenticatePageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{

}


export function AuthenticatePage( { location, navigate, style = {}, className = "", children, ...props }: AuthenticatePageProps )
{
	
	function handleAuthenticate( type: "login" | "signup", credentials: authenticationCredentials )
	{
		// gatekeeper.login( credentials )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticatePage`}
		>
			<LoginOrSignup
				onAuthenticate={handleAuthenticate}
				alert={undefined}
				action="login"
				loading={false}
			/>
		</div>
	)
}


export interface Gatekeeper
{
	login( credentials: authenticationCredentials ): Promise<void>
}

feature( `User can log in`, () => {
	const gatekeeper = object<Gatekeeper>()
	
	scenario( `Success`, () => {
		given( () => {
		
		} )
		
		
		test( `I can log in`, () => {
			const { login }                              = renderAuthPage(),
			      credentials: authenticationCredentials = { email: "user@email.com", password: "$password$" }
			
			login( credentials )
			
			// given my credentials are authorized
			
			// when I log in
			
			// then I should see a success message
		} )
		
		// sends success message
		
		// redirects after x
	} )
} )


function renderAuthPage()
{
	const wrapper = appRender( "/auth" )
	
	
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
