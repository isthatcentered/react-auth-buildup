import * as React from "react"
import { FunctionComponent, HTMLAttributes, useLayoutEffect, useState } from "react"
import { func, object, verify, when } from "testdouble"
import { NavigateFn, RouteComponentProps } from "@reach/router"
import { act, render } from "react-testing-library"
import { and, feature, given, scenario, then } from "jest-case"




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
		authProvider
			.login( credentials )
			.then( () => navigate!( "/" ) )
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
	let authProvider: AuthProvider, credentials: authCredentials
	
	given( () => {
		authProvider = object<AuthProvider>()
		credentials = fake<authCredentials>( "credentials" )
	} )
	
	given( () => when( authProvider.isAuthenticated() ).thenReturn( false ) )
	
	given( () => when( authProvider.login( credentials ) ).thenResolve() )
	
	scenario( `Success`, () => {
		then( `A loader is displayed`, () => {
			render( <AuthenticationPage
				authProvider={authProvider}
				navigate={jest.fn()}
			/> )
			
			const props: AuthenticationPageViewProps = [ ...(AuthenticationPageView as jest.Mock).mock.calls ].last()[ 0 ]
			
			act( () => props.onLogin( credentials ) )
			
			expect( AuthenticationPageView ).lastCalledWith( expect.objectContaining( { loading: true } ), expect.anything() )
		} )
		
		and( `User is redirected to home`, async () => {
			const navigate = func<NavigateFn>()
			
			when( authProvider.login( credentials ) ).thenResolve()
			
			render( <AuthenticationPage
				authProvider={authProvider}
				navigate={navigate}
			/> )
			
			
			const props: AuthenticationPageViewProps = [ ...(AuthenticationPageView as jest.Mock).mock.calls ].last()[ 0 ]
			
			act( () => props.onLogin( credentials ) )
			
			await Promise.resolve()
			
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