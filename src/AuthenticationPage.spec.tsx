import * as React from "react"
import { FunctionComponent, HTMLAttributes, useLayoutEffect, useState } from "react"
import { func, object, verify, when } from "testdouble"
import { NavigateFn, RouteComponentProps } from "@reach/router"
import { act, render } from "react-testing-library"
import { and, feature, given, scenario, then, xand } from "jest-case"




interface AuthenticationPageViewProps extends HTMLAttributes<HTMLDivElement>
{
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
	const [ loading, setLoading ] = useState( false )
	
	useLayoutEffect( () => {
		if ( authProvider.isAuthenticated() )
			navigate!( "/" )
	} )
	
	
	function handleLogin( credentials: authCredentials )
	{
		setLoading( true )
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
			/>
		</div>
	)
}


beforeEach( () => (AuthenticationPageView as jest.Mock).mockClear() )

feature( `Only logged out users can access the page`, () => {
	let navigate: NavigateFn, authProvider: AuthProvider
	
	given( () => {
		navigate = func<NavigateFn>()
		authProvider = object<AuthProvider>()
	} )
	
	scenario( `Already logged in`, () => {
		then( `User is redirected to home`, () => {
			when( authProvider.isAuthenticated() ).thenReturn( true )
			
			render( <AuthenticationPage
				authProvider={authProvider}
				navigate={navigate}/> )
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Not logged in`, () => {
		then( `User is not redirected to home`, () => {
			when( authProvider.isAuthenticated() ).thenReturn( false )
			
			render( <AuthenticationPage
				authProvider={authProvider}
				navigate={navigate}/> )
			
			verify( navigate( "/" ), { times: 0 } )
		} )
	} )
} )

feature( `A user can log in`, () => {
	let authProvider: AuthProvider
	
	given( () => {
		authProvider = object<AuthProvider>()
		when( authProvider.isAuthenticated() ).thenReturn( false )
	} )
	
	scenario( `Success`, () => {
		then( `A loader is displayed`, () => {
			render( <AuthenticationPage
				authProvider={authProvider}
			/> )
			
			const props: AuthenticationPageViewProps = [ ...(AuthenticationPageView as jest.Mock).mock.calls ].last()[ 0 ]
			
			act( () => props.onLogin( object<authCredentials>( "credentials" ) ) )
			
			expect( AuthenticationPageView ).lastCalledWith( expect.objectContaining( { loading: true } ), expect.anything() )
		} )
		
		xand( `User is redirected to home`, () => {
			const navigate    = func<NavigateFn>(),
			      credentials = object<authCredentials>( "credentials" )
			
			render( <AuthenticationPage
				authProvider={authProvider}
				navigate={navigate}
			/> )
			
			when( authProvider.login( credentials ) ).thenResolve()
			
			const props: AuthenticationPageViewProps = [ ...(AuthenticationPageView as jest.Mock).mock.calls ].last()[ 0 ]
			
			act( () => props.onLogin( credentials ) )
			
			verify( navigate( "/" ) )
		} )
	} )
	
	scenario( `Error`, () => {
		then( `An error message is passed to the view`, () => {
		
		} )
		
		
		and( `The error message is emptied on new submit (case for different error returned as success redirects)`, () => {
		
		} )
		
		and( `Loader disabled`, () => {
		} )
	} )
} )