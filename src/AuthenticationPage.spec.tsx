import * as React from "react"
import { ReactElement } from "react"
import { func, object, verify, when } from "testdouble"
import { createHistory, createMemorySource, LocationProvider, NavigateFn } from "@reach/router"
import { fireEvent, render } from "react-testing-library"
import { feature, given, scenario, then } from "jest-then"
import { App } from "./App"
import { AuthPage } from "./AuthenticationPage"
import { authCredentials, Gatekeeper } from "./Gatekeeper"




export const gatekeeper: Gatekeeper = object<Gatekeeper>()

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
		const { login, navigate, debug } = renderAuthPage()
		
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
		const { signup, navigate, click, debug } = renderAuthPage()
		
		click( /signup/i )
		
		signup( CREDENTIALS )
		
		verify( navigate( "/", undefined ), { times: 0 } )
		
		await tick()
		
		verify( navigate( "/", undefined ), { times: 1 } )
	} )
	
	
	// @todo: Switching tabs back and forth
	// @todo: Extract auth method, this is the same thing as login
	// @todo: onSucces/onError callback
	// @todo: tabs controlled by url
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


/*
let gatekeeper: AuthProvider

beforeEach( () => {
	(AuthenticationPageView as jest.Mock).mockClear();
	gatekeeper = object<AuthProvider>()
} )

feature( `Only logged out users can access the page`, () => {
	beforeEach( () => {
		gatekeeper = object<AuthProvider>()
	} )
	
	scenario( `Already logged in`, () => {
		given( () => when( gatekeeper.isAuthenticated() ).thenReturn( true ) )
		
		then( `User is redirected to home`, () => {
			const { navigate } = renderAuthPage( gatekeeper )
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Not logged in`, () => {
		given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
		
		then( `User is not redirected to home`, () => {
			const { navigate } = renderAuthPage( gatekeeper )
			
			verify( navigate( "/" ), { times: 0 } )
		} )
	} )
} )

// @todo: those two featue (signup/login) are exactly the same, merge them
feature( `A user can log in`, () => {
	let credentials: authCredentials = fake<authCredentials>( "credentials" )
	
	scenario( `Success`, () => {
		given( () => {
			when( gatekeeper.isAuthenticated() ).thenReturn( false )
			when( gatekeeper.login( credentials ) ).thenResolve()
		} )
		
		then( `A loader is displayed`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			view.onLogin( credentials )
			
			expect( view.loading ).toBe( true )
		} )
		
		and( `A success message is passed to the view`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			expect( view.authorized ).not.toBeDefined()
			
			view.onLogin( credentials )
			
			await tick()
			
			expect( view.authorized ).toBeDefined()
		} )
		
		and( `The loader is disabled`, async () => {
			jest.useFakeTimers()
			
			const { view } = renderAuthPage( gatekeeper )
			
			view.onLogin( credentials )
			
			await tick()
			
			expect( view.loading ).toBe( false )
		} )
		
		then( `User is redirected to home after a timeout`, async () => {
			const { view, navigate } = renderAuthPage( gatekeeper )
			
			view.onLogin( credentials )
			
			await tick()
			
			verify( navigate( "/" ), { times: 0 } )
			
			jest.advanceTimersByTime( 3000 )
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Login refused`, () => {
		const error = fake<Error>( "error" )
		
		given( () => {
			when( gatekeeper.isAuthenticated() ).thenReturn( false )
			when( gatekeeper.login( credentials ) ).thenReject( error )
		} )
		
		then( `An error message is passed to the view`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			view.onLogin( credentials )
			
			await tick()
			
			expect( view.error ).toBe( error )
		} )
		
		and( `Loader is disabled`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			view.onLogin( credentials )
			
			await tick()
			
			expect( view.loading ).toBe( false )
		} )
	} )
} )

// @todo: those two featue (signup/login) are exactly the same, merge them
feature( `A user can sign-in`, () => {
	let credentials: authCredentials = fake<authCredentials>( "credentials" )
	
	scenario( `Success`, () => {
		given( () => {
			when( gatekeeper.isAuthenticated() ).thenReturn( false )
			when( gatekeeper.signup( credentials ) ).thenResolve()
		} )
		
		then( `A loader is displayed`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			view.onSignup( credentials )
			
			expect( view.loading ).toBe( true )
		} )
		
		and( `A success message is passed to the view`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			expect( view.authorized ).not.toBeDefined()
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.authorized ).toBeDefined()
		} )
		
		and( `The loader is disabled`, async () => {
			jest.useFakeTimers()
			
			const { view } = renderAuthPage( gatekeeper )
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.loading ).toBe( false )
		} )
		
		then( `User is redirected to home after a timeout`, async () => {
			const { view, navigate } = renderAuthPage( gatekeeper )
			
			view.onSignup( credentials )
			
			await tick()
			
			verify( navigate( "/" ), { times: 0 } )
			
			jest.advanceTimersByTime( 3000 )
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Sign-up error`, () => {
		const error = fake<Error>( "error" )
		
		given( () => {
			when( gatekeeper.isAuthenticated() ).thenReturn( false )
			when( gatekeeper.signup( credentials ) ).thenReject( error )
		} )
		
		then( `An error message is passed to the view`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.error ).toBe( error )
		} )
		
		and( `Loader is disabled`, async () => {
			const { view } = renderAuthPage( gatekeeper )
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.loading ).toBe( false )
		} )
	} )
} )

feature( `Switching between login and sign-up tab`, () => {
	test( `Login tab is active by default`, () => {
		const { view } = renderAuthPage( gatekeeper )
		
		expect( view.tab ).toBe( "login" )
	} )
	
	test( `View gets the new activated tab`, () => {
		const { view } = renderAuthPage( gatekeeper )
		
		view.onTabSelect( "signup" )
		expect( view.tab ).toBe( "signup" )
		
		view.onTabSelect( "login" )
		expect( view.tab ).toBe( "login" )
		
		view.onTabSelect( "login" )
		expect( view.tab ).toBe( "login" )
	} )
} )

xtest( `Separating "state" (loading, tab) and "dispatchers" (onlogin, onsigup,...)`, () => {
	fail()
} )

xtest( `Does the design tell the right story, doesn't this do too much ?`, () => {
	// maybe the only goal of this thing is to redirect
	// and then there's a loginOrSignup component that handles the tab part
	// and the a login and a signup component thath handle the submit
	// the controller doesn't care which tab is active, it cares about signing up or logging in and preventing page access -> or rather providing the required data. nothing else
	// i like a useGuard or a protected route component, the separation of singup/login logic i don't know
	fail()
} )

function renderAuthPage( gatekeeper: AuthProvider )
{
	const navigate = func<NavigateFn>(),
	      wrapper  = render( <AuthenticationPage
		      gatekeeper={gatekeeper}
		      navigate={navigate}
	      /> )
	
	const view: AuthenticationPageViewProps = new Proxy( {}, {
		get( target, prop )
		{
			return [ ...(AuthenticationPageView as jest.Mock).mock.calls ].last()[ 0 ][ prop ]
		},
	} ) as any
	
	return {
		...wrapper,
		navigate,
		gatekeeper,
		view,
	}
}
*/


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
