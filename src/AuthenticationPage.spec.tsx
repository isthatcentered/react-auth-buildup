import * as React from "react"
import { FunctionComponent, HTMLAttributes, useLayoutEffect, useState } from "react"
import { func, object, verify, when } from "testdouble"
import { NavigateFn, RouteComponentProps } from "@reach/router"
import { render } from "react-testing-library"
import { and, feature, given, scenario, then } from "jest-case"




type availableAuthenticationMethods = "signup" | "login"

interface redirectMessage
{
	message: string,
	timeout: number
}

interface AuthenticationPageViewProps extends HTMLAttributes<HTMLDivElement>
{
	authorized: redirectMessage | undefined
	
	tab: availableAuthenticationMethods
	
	error: Error | undefined;
	
	onTabSelect( tab: availableAuthenticationMethods ): any;
	
	onLogin( credentials: authCredentials ): any;
	
	onSignup( credentials: authCredentials ): any;
	
	loading: boolean
}

interface authCredentials
{
	email: string
	password: string
}

const AuthenticationPageView: FunctionComponent<AuthenticationPageViewProps> = jest.fn( ( props: AuthenticationPageViewProps ) => null )

interface AuthProvider
{
	login( credentials: authCredentials ): Promise<undefined>;
	
	isAuthenticated(): boolean;
	
	signup( credentials: authCredentials ): Promise<undefined>
}


export interface AuthenticationPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	authProvider: AuthProvider
}


export function AuthenticationPage( { authProvider, navigate, location, style = {}, className = "", children, ...props }: AuthenticationPageProps )
{
	const [ loading, setLoading ] = useState( false ),
	      [ error, setError ]     = useState<Error | undefined>( undefined ),
	      [ tab, setTab ]         = useState<availableAuthenticationMethods>( "login" ),
	      [ message, setMessage ] = useState<redirectMessage | undefined>( undefined )
	
	
	useLayoutEffect( () => {
		if ( authProvider.isAuthenticated() )
			navigate!( "/" )
	} )
	
	
	function authenticate( type: "login" | "signup", credentials: authCredentials )
	{
		setLoading( true )
		
		authProvider
			[ type ]( credentials )
			.then( () => {
				setMessage( { message: "Log-in successful, redirecting to home", timeout: 3000 } )
				setTimeout( () => navigate!( "/" ), 3000 )
			} )
			.catch( setError )
			.finally( () => setLoading( false ) )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPage`}
		>
			<AuthenticationPageView
				authorized={message}
				onLogin={credentials => authenticate( "login", credentials )}
				onSignup={credentials => authenticate( "signup", credentials )}
				loading={loading}
				error={error}
				tab={tab}
				onTabSelect={tab => setTab( tab )}
			/>
		</div>
	)
}



let authProvider: AuthProvider

beforeEach( () => {
	(AuthenticationPageView as jest.Mock).mockClear();
	authProvider = object<AuthProvider>()
} )

feature( `Only logged out users can access the page`, () => {
	beforeEach( () => {
		authProvider = object<AuthProvider>()
	} )
	
	scenario( `Already logged in`, () => {
		given( () => when( authProvider.isAuthenticated() ).thenReturn( true ) )
		
		then( `User is redirected to home`, () => {
			const { navigate } = renderAuthPage( authProvider )
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Not logged in`, () => {
		given( () => when( authProvider.isAuthenticated() ).thenReturn( false ) )
		
		then( `User is not redirected to home`, () => {
			const { navigate } = renderAuthPage( authProvider )
			
			verify( navigate( "/" ), { times: 0 } )
		} )
	} )
} )

// @todo: those two featue (signup/login) are exactly the same, merge them
feature( `A user can log in`, () => {
	let credentials: authCredentials = fake<authCredentials>( "credentials" )
	
	scenario( `Success`, () => {
		given( () => {
			when( authProvider.isAuthenticated() ).thenReturn( false )
			when( authProvider.login( credentials ) ).thenResolve()
		} )
		
		then( `A loader is displayed`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			view.onLogin( credentials )
			
			expect( view.loading ).toBe( true )
		} )
		
		and( `A success message is passed to the view`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			expect( view.authorized ).not.toBeDefined()
			
			view.onLogin( credentials )
			
			await tick()
			
			expect( view.authorized ).toBeDefined()
		} )
		
		and( `The loader is disabled`, async () => {
			jest.useFakeTimers()
			
			const { view } = renderAuthPage( authProvider )
			
			view.onLogin( credentials )
			
			await tick()
			
			expect( view.loading ).toBe( false )
		} )
		
		then( `User is redirected to home after a timeout`, async () => {
			const { view, navigate } = renderAuthPage( authProvider )
			
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
			when( authProvider.isAuthenticated() ).thenReturn( false )
			when( authProvider.login( credentials ) ).thenReject( error )
		} )
		
		then( `An error message is passed to the view`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			view.onLogin( credentials )
			
			await tick()
			
			expect( view.error ).toBe( error )
		} )
		
		and( `Loader is disabled`, async () => {
			const { view } = renderAuthPage( authProvider )
			
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
			when( authProvider.isAuthenticated() ).thenReturn( false )
			when( authProvider.signup( credentials ) ).thenResolve()
		} )
		
		then( `A loader is displayed`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			view.onSignup( credentials )
			
			expect( view.loading ).toBe( true )
		} )
		
		and( `A success message is passed to the view`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			expect( view.authorized ).not.toBeDefined()
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.authorized ).toBeDefined()
		} )
		
		and( `The loader is disabled`, async () => {
			jest.useFakeTimers()
			
			const { view } = renderAuthPage( authProvider )
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.loading ).toBe( false )
		} )
		
		then( `User is redirected to home after a timeout`, async () => {
			const { view, navigate } = renderAuthPage( authProvider )
			
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
			when( authProvider.isAuthenticated() ).thenReturn( false )
			when( authProvider.signup( credentials ) ).thenReject( error )
		} )
		
		then( `An error message is passed to the view`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.error ).toBe( error )
		} )
		
		and( `Loader is disabled`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			view.onSignup( credentials )
			
			await tick()
			
			expect( view.loading ).toBe( false )
		} )
	} )
} )

feature( `Switching between login and sign-up tab`, () => {
	test( `Login tab is active by default`, () => {
		const { view } = renderAuthPage( authProvider )
		
		expect( view.tab ).toBe( "login" )
	} )
	
	test( `View gets the new activated tab`, () => {
		const { view } = renderAuthPage( authProvider )
		
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


function renderAuthPage( authProvider: AuthProvider )
{
	const navigate = func<NavigateFn>(),
	      wrapper  = render( <AuthenticationPage
		      authProvider={authProvider}
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
		authProvider,
		view,
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


function tick(): Promise<undefined>
{
	return new Promise( resolve =>
		process.nextTick( () => resolve() ) )
}