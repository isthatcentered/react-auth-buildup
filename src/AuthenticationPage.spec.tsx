import * as React from "react"
import { ReactElement } from "react"
import { func, object, verify, when } from "testdouble"
import { createHistory, createMemorySource, LocationProvider, NavigateFn } from "@reach/router"
import { fireEvent, render } from "react-testing-library"
import { and, feature, given, scenario, then } from "jest-then"
import { App } from "./App"
import { AuthPage } from "./AuthenticationPage"
import { authCredentials, Gatekeeper } from "./Gatekeeper"




const gatekeeper: Gatekeeper = object<Gatekeeper>()

// @todo: not logged in case
// @todo: add an onSuccess callback for the guy above to handle the redirect
// @todo: move to custom useGuard(onSuccess, onError) / useAlreadyLoggedInGuard()
// @todo: Display a message on login fail
// @todo: Display a message on login success
// @todo: Timed out redirect on login success
// @todo: Loading state during authentication
// @todo: tabs controlled by url
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
} )

feature( `A user can log in`, () => {
	const CREDENTIALS: Readonly<authCredentials> = { email: "user@email.com", password: "password" }
	
	given( () => when( gatekeeper.authenticated() ).thenReturn( false ) )
	
	given( () => when( gatekeeper.login( CREDENTIALS ) ).thenResolve() )
	
	then( `I should see a success message`, async () => {
		const { login, getByText } = renderAuthPage()
		
		login( CREDENTIALS )
		
		await tick()
		
		expect( () => getByText( /success/i ) ).not.toThrow()
	} )
	
	and( `I should be redirected to home`, async () => {
		const { login, navigate } = renderAuthPage()
		
		login( CREDENTIALS )
		
		verify( navigate( "/", undefined ), { times: 0 } )
		
		await tick()
		
		verify( navigate( "/", undefined ), { times: 1 } )
	} )
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
