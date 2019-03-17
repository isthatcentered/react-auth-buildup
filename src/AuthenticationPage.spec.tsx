import * as React from "react"
import { FunctionComponent, HTMLAttributes, useLayoutEffect, useState } from "react"
import { func, object, verify, when } from "testdouble"
import { NavigateFn, RouteComponentProps } from "@reach/router"
import { render } from "react-testing-library"
import { and, feature, given, scenario, then } from "jest-case"




type availableAuthenticationMethods = "signup" | "login"

interface AuthenticationPageViewProps extends HTMLAttributes<HTMLDivElement>
{
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
	      [ tab, setTab ]         = useState<availableAuthenticationMethods>( "login" )
	
	useLayoutEffect( () => {
		if ( authProvider.isAuthenticated() )
			navigate!( "/" )
	} )
	
	
	function authenticate( type: "login" | "signup", credentials: authCredentials )
	{
		setLoading( true )
		
		authProvider
			[ type ]( credentials )
			.then( () => navigate!( "/" ) )
			.catch( err => {
				setError( err )
				setLoading( false )
			} )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPage`}
		>
			<AuthenticationPageView
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
	
	scenario( `Login successful`, () => {
		given( () => {
			when( authProvider.isAuthenticated() ).thenReturn( false )
			when( authProvider.login( credentials ) ).thenResolve()
		} )
		
		then( `A loader is displayed`, () => {
			const { view } = renderAuthPage( authProvider )
			
			view.onLogin( credentials )
			
			expect( view.loading ).toBe( true )
		} )
		
		and( `User is redirected to home`, async () => {
			const { view, navigate } = renderAuthPage( authProvider )
			
			view.onLogin( credentials )
			
			await tick()
			
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
			
			await tick()
			
			expect( view.loading ).toBe( true )
		} )
		
		then( `User is redirected to home`, async () => {
			const { view, navigate } = renderAuthPage( authProvider )
			
			view.onSignup( credentials )
			
			await tick()
			
			verify( navigate( "/" ) )
		} )
		
		then( `User is redirected to home after message + timeout`, () => {
			fail()
			// @todo: display a "success message", redirecting in x
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