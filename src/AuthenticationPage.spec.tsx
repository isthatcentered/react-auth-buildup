import * as React from "react"
import { HTMLAttributes, useContext, useState } from "react"
import { feature, given, scenario } from "jest-then";
import { appRender, tick } from "./testUtils"
import { RouteComponentProps } from "@reach/router"
import { authenticationCredentials } from "./AuthenticationPage/AuthenticationForm"
import { LoginOrSignup, LoginOrSignupProps } from "./AuthenticationPage/LogInOrSignup"
import { object, when } from "testdouble"
import { ContainerContext } from "./ServicesContainer"



// jest.mock( "./random" )
// import { Burron } from "./random"
//
//
//
//
// expect( button ).lastWith( "" )
// jest.clearAllMocks()


export interface Gatekeeper
{
	login( credentials: authenticationCredentials ): Promise<void>
}


interface AuthenticatePageProps extends HTMLAttributes <HTMLDivElement>, RouteComponentProps
{

}


export function AuthenticatePage( { location, navigate, style = {}, className = "", children, ...props }: AuthenticatePageProps )
{
	const { gatekeeper }      = useContext( ContainerContext ),
	      [ state, setState ] = useState<LoginOrSignupProps>( {
		      loading:        false,
		      alert:          undefined,
		      action:         "login",
		      onAuthenticate: () => null,
	      } )
	
	
	function handleAuthenticate( type: "login" | "signup", credentials: authenticationCredentials )
	{
		setState( {
			loading:        true,
			alert:          undefined,
			action:         "login",
			onAuthenticate: () => null,
		} )
		
		gatekeeper.login( credentials )
			.then( () => {
				setState( {
					loading:        false,
					alert:          { type: "success", message: "Success, redirecting in ..." },
					action:         "login",
					onAuthenticate: () => null,
				} )
			} )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticatePage`}
		>
			<LoginOrSignup{...state} onAuthenticate={handleAuthenticate}/>
		</div>
	)
}


const fakeGatekeeper = object<Gatekeeper>()
feature( `User can log in`, () => {
	
	scenario( `Success`, () => {
		const credentials: authenticationCredentials = { email: "user@email.com", password: "$password$" }
		
		given( () => when( fakeGatekeeper.login( credentials ) ).thenResolve() )
		
		test( `I can log in`, async () => {
			const { login, getByText } = renderAuthPage()
			
			// when I log in
			login( credentials )
			
			await tick()
			
			// then I should see a success message
			getByText( /Success, redirecting/i )
		} )
		
		// sends success message
		
		// redirects after x
	} )
} )


function renderAuthPage()
{
	const wrapper = appRender( "/auth", { gatekeeper: fakeGatekeeper } )
	
	
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
