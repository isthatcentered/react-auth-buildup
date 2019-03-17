import * as React from "react"
import { FunctionComponent, HTMLAttributes, useLayoutEffect, useState } from "react"
import { func, object, verify, when } from "testdouble"
import { NavigateFn, RouteComponentProps } from "@reach/router"
import { act, render } from "react-testing-library"
import { and, feature, given, scenario, then } from "jest-case"




interface AuthenticationPageViewProps extends HTMLAttributes<HTMLDivElement>
{
	error: Error | undefined;
	
	onLogin( credentials: authCredentials ): void;
	
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
}


export interface AuthenticationPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	authProvider: AuthProvider
}


export function AuthenticationPage( { authProvider, navigate, location, style = {}, className = "", children, ...props }: AuthenticationPageProps )
{
	const [ loading, setLoading ] = useState( false ),
	      [ error, setError ]     = useState<Error | undefined>( undefined )
	
	useLayoutEffect( () => {
		if ( authProvider.isAuthenticated() ) {
			navigate!( "/" )
		}
	} )
	
	
	function handleLogin( credentials: authCredentials )
	{
		setLoading( true )
		authProvider
			.login( credentials )
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
				onLogin={handleLogin}
				loading={loading}
				error={error}
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

feature( `A user can log in`, () => {
	let credentials: authCredentials = fake<authCredentials>( "credentials" )
	
	scenario( `Success`, () => {
		given( () => {
			when( authProvider.isAuthenticated() ).thenReturn( false )
			when( authProvider.login( credentials ) ).thenResolve()
		} )
		
		then( `A loader is displayed`, () => {
			const { view } = renderAuthPage( authProvider )
			
			act( () => view.onLogin( credentials ) )
			
			expect( view.loading ).toBe( true )
		} )
		
		and( `User is redirected to home`, async () => {
			const { view, navigate } = renderAuthPage( authProvider )
			
			act( () => view.onLogin( credentials ) )
			
			await Promise.resolve()
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Error`, () => {
		const error = fake<Error>( "error" )
		
		given( () => {
			when( authProvider.isAuthenticated() ).thenReturn( false )
			when( authProvider.login( credentials ) ).thenReject( error )
		} )
		
		then( `An error message is passed to the view`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			act( () => view.onLogin( credentials ) )
			
			await Promise.resolve()
			
			expect( view.error ).toBe( error )
		} )
		
		and( `Loader is disabled`, async () => {
			const { view } = renderAuthPage( authProvider )
			
			act( () => view.onLogin( credentials ) )
			
			await Promise.resolve()
			
			expect( view.loading ).toBe( false )
		} )
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