import * as React from "react"
import { FunctionComponent, HTMLAttributes, useLayoutEffect } from "react"
import { func, object, verify, when } from "testdouble"
import { NavigateFn, RouteComponentProps } from "@reach/router"
import { render } from "react-testing-library"
import { and, feature, given, scenario, then, xfeature } from "jest-case"




interface AuthenticationPageViewProps extends HTMLAttributes<HTMLDivElement>
{
}

const AuthenticationPageView: FunctionComponent<AuthenticationPageViewProps> = jest.fn( () => null )

interface AuthProvider
{
	isAuthenticated(): boolean;
}

export interface AuthenticationPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	authProvider: AuthProvider
}


export function AuthenticationPage( { authProvider, navigate, location, style = {}, className = "", children, ...props }: AuthenticationPageProps )
{
	
	useLayoutEffect( () => {
		if ( authProvider.isAuthenticated() )
			navigate!( "/" )
	} )
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPage`}
		>
			<AuthenticationPageView/>
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

xfeature( `A user can log in`, () => {
	let authProvider: AuthProvider
	
	given( () => {
		authProvider = object<AuthProvider>()
		when( authProvider.isAuthenticated() ).thenReturn( false )
	} )
	
	scenario( `Success`, () => {
		then( `A loader is displayed`, () => {
			// (AuthenticationPageView as jest.Mock).mock.calls.last()
			
			
			
			expect( AuthenticationPageView ).lastCalledWith( { loading: true }, expect.anything() )
		} )
		
		and( `User is redirected to home`, () => {
		
		} )
	} )
	
	scenario( `Error`, () => {
		then( `An error message is passed to the view`, () => {
		
		} )
		
		then( `The error message is emptied on new submit (case for different error returned as success redirects)`, () => {
		
		} )
	} )
} )