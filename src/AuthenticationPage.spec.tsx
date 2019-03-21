import * as React from "react"
import { HTMLAttributes, ReactElement, useEffect } from "react"
import { func, object, verify, when } from "testdouble"
import { NavigateFn, RouteComponentProps } from "@reach/router"
import { act, fireEvent, render } from "react-testing-library"
import { feature, given, scenario, then } from "jest-then"




export interface AuthPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	gatekeeper: Gatekeeper
}


export function AuthPage( { gatekeeper, navigate, location, style = {}, className = "", children, ...props }: AuthPageProps )
{
	useEffect( () => {
		if ( gatekeeper.authenticated() )
			navigate!( "/" )
	} )
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthPage`}
		>
			AuthPage
		</div>
	)
}


interface Gatekeeper
{
	authenticated(): boolean
}

feature( `Only non logged user can access the page`, () => {
	scenario( `Already logged in`, () => {
		given( () => {
		
		} )
		
		then( `User is redirected to home`, () => {
			const gatekeeper: Gatekeeper = object<Gatekeeper>(),
			      navigate: NavigateFn   = func<NavigateFn>()
			
			when( gatekeeper.authenticated() ).thenReturn( true )
			
				customRender( <AuthPage gatekeeper={gatekeeper}
				                        navigate={navigate}/> )
			
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Already logged in`, () => {
		given( () => {
		
		} )
		
		then( `User is redirected to home`, () => {
			const gatekeeper: Gatekeeper = object<Gatekeeper>(),
			      navigate: NavigateFn   = func<NavigateFn>()
			
			when( gatekeeper.authenticated() ).thenReturn( false )
			
				customRender( <AuthPage gatekeeper={gatekeeper}
				                        navigate={navigate}/> )
			
			verify( navigate( "/" ), { times: 0 } )
		} )
	} )
	
	// @todo: not logged in
	// @todo: add an onSuccess callback for the guy aove to handle the redirect
} )



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
