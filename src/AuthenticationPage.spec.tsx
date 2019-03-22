import * as React from "react"
import { ReactElement } from "react"
import { func, object, verify, when } from "testdouble"
import { createHistory, createMemorySource, LocationProvider, NavigateFn } from "@reach/router"
import { fireEvent, render } from "react-testing-library"
import { feature, given, scenario, then } from "jest-then"
import { App } from "./App"
import { AuthPage } from "./AuthenticationPage"
import { authCredentials, Gatekeeper } from "./Gatekeeper"




const gatekeeper: Gatekeeper = object<Gatekeeper>()

feature( `Only non logged user can access the page`, () => {
	scenario( `Already logged in`, () => {
		given( () => when( gatekeeper.authenticated() ).thenReturn( true ) )
		
		then( `User is redirected to home`, () => {
			const navigate: NavigateFn = func<NavigateFn>()
			
			customRender( <AuthPage gatekeeper={gatekeeper}
			                        navigate={navigate}/> )
			
			verify( navigate( "/" ) )
		} )
	} )
	
	// @todo: not logged in case
	// @todo: add an onSuccess callback for the guy above to handle the redirect
	// @todo: move to custom useGuard(onSuccess, onError) / useAlreadyLoggedInGuard()
} )

feature( `A user can log in`, () => {
	const CREDENTIALS: Readonly<authCredentials> = { email: "user@email.com", password: "password" }
	
	given( () => when( gatekeeper.authenticated() ).thenReturn( false ) )
	
	given( () => when( gatekeeper.login( CREDENTIALS ) ).thenResolve() )
	
	then( `I should be redirected to home`, async () => {
		const { login, navigate } = renderAuthPage()
		
		login( CREDENTIALS )
		
		verify( navigate( "/", undefined ), { times: 0 } )
		
		await tick()
		
		verify( navigate( "/", undefined ), { times: 1 } )
	} )
	
	// @todo: Empty form cannot submit
	// @todo: Login rejected
	// @todo: Display a message on login fail
	// @todo: Display a message on login success
	// @todo: Timed out redirect on login success
	// @todo: Loading state during authentication
} )

feature( `A user can sign up`, () => {
	const CREDENTIALS: Readonly<authCredentials> = { email: "user@email.com", password: "password" }
	
	given( () => when( gatekeeper.authenticated() ).thenReturn( false ) )
	
	given( () => when( gatekeeper.signup( CREDENTIALS ) ).thenResolve() )
	
	then( `I should be redirected to home`, async () => {
		const { signup, navigate, click } = renderAuthPage()
		
		click( /signup/i )
		
		signup( CREDENTIALS )
		
		verify( navigate( "/", undefined ), { times: 0 } )
		
		await tick()
		
		verify( navigate( "/", undefined ), { times: 1 } )
	} )
	
	// @todo: onSucces/onError callback
	// @todo: tabs controlled by url
	// @todo: Extract auth method, this is the same thing as login
} )

feature( `I can switch between login & signup tabs`, () => {
	
	given( () => when( gatekeeper.authenticated() ).thenReturn( false ) )
	
	then( `It displays the correct tab`, async () => {
		const { click, getByText } = renderAuthPage()
		
		click( /signup/i )
		
		expect( () => getByText( /sign me up/i ) ).not.toThrow()
		
		click( /login/i )
		
		expect( () => getByText( /log me in/i ) ).not.toThrow()
	} )
	
	then( `Active tab is styled correctly`, async () => {
		const { click, getByText } = renderAuthPage()
		
		click( /login/i )
		
		expect( getByText( /login/i ) ).toHaveClass( "bg-white", "text-blue-darker", "border-transparent" )
		expect( getByText( /signup/i ) ).toHaveClass( "text-grey-darkest", "border-grey-lighter" )
		
		click( /signup/i )
		
		expect( getByText( /signup/i ) ).toHaveClass( "bg-white", "text-blue-darker", "border-transparent" )
		expect( getByText( /login/i ) ).toHaveClass( "text-grey-darkest", "border-grey-lighter" )
	} )
	
	
	// @todo: Switching tabs back and forth
	// @todo: active tab style
} )


function renderAuthPage( gatekeep: Gatekeeper = gatekeeper )
{
	const history = {
		...createHistory( createMemorySource( "/authenticate" ) ),
		navigate: func<NavigateFn>(),
	}
	
	const wrapper = customRender(
		<LocationProvider history={history}>
			<App gatekeeper={gatekeeper}/>
		</LocationProvider>,
	)
	
	const login = ( { email, password }: authCredentials ) => {
		wrapper.fill( /email/i, email )
		wrapper.fill( /password/i, password )
		wrapper.click( /log me in/i )
	}
	const signup = ( { email, password }: authCredentials ) => {
		wrapper.fill( /email/i, email )
		wrapper.fill( /password/i, password )
		wrapper.click( /sign me up/i )
	}
	
	return {
		...wrapper,
		login,
		signup,
		navigate: history.navigate,
	}
}



function fake<T>( name: string ): T
{
	return name as any as T
}


function aside<T>( cb: ( res: any ) => void ): ( res: T ) => T
{
	return ( res ) => {
		
		cb( res )
		
		return res
	}
}


export function tick(): Promise<undefined>
{
	return new Promise( resolve =>
		process.nextTick( () => resolve() ) )
}


export function customRender( component: ReactElement<any> )
{
	const utils = render( component )
	
	const change = ( label: RegExp, value: any ) =>
		fireEvent.change( utils.getByLabelText( label ), { target: { value } } )
	
	const fill = ( label: RegExp, value: string ) => change( label, value )
	
	const slide = ( label: RegExp, value: number ) => change( label, value )
	
	const click = ( label: RegExp ) =>
		fireEvent.click( utils.getByText( label ) )
	
	const submit = ( label: RegExp ) =>
		fireEvent.submit( (utils.getByText( label ) as HTMLElement).closest( "form" )! )
	
	
	return {
		...utils,
		wrapper: utils.container.firstChild as HTMLElement,
		change,
		fill,
		slide,
		click,
		submit,
	}
}
