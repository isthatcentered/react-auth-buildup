import React, { Component, HTMLAttributes, useContext, useEffect, useState } from "react";
import "./App.css";
import { Header } from "./Header"
import { navigate, Redirect, RouteComponentProps, Router } from "@reach/router"
import { AuthContext, AuthorizationProvider, AuthProvider } from "./AuthContext"
import { LoginPage } from "./LoginPage"
import { HomePage } from "./HomePage"
import { LogoutPage } from "./LogoutPage"
import { NotFoundPage } from "./NotFoundPage"




export interface ProtectedRouteProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	guard?( authProvider: AuthorizationProvider ): Promise<boolean>
	
	component: any
}


export function ProtectedRoute( { guard = ( authProvider ) => Promise.resolve( authProvider.isAuthenticated ), component: Component, ...props }: ProtectedRouteProps )
{
	const authProvider                  = useContext( AuthContext ),
	      [ authorized, setAuthorized ] = useState<boolean>( false ),
	      [ loaded, setLoaded ]         = useState<boolean>( false )
	
	useEffect( () => {
		guard( authProvider ).then( authorized => {
			setAuthorized( authorized )
			setLoaded( true )
		} )
	} )
	
	return (() => {
		if ( !loaded )
			return <p>Loading...👨‍🚀</p>
		
		return authorized ?
		       <Component {...props} /> :
		       <Redirect to="/login"
		                 noThrow/>
	})()
}



type useProtectedRouteGuard = ( authProvider: AuthorizationProvider ) => void

const defaultGuard: useProtectedRouteGuard = ( auth ) => {
	if ( !auth.isAuthenticated )
		navigate( "/login" )
}


export function useProtectedRoute( guard: useProtectedRouteGuard = defaultGuard ): { loading: boolean, authorized: boolean }
{
	const authProvider                  = useContext( AuthContext ),
	      [ loading, setLoading ]       = useState( true ),
	      [ authorized, setAuthorized ] = useState( true )
	
	useEffect( () => {
		guard( authProvider ) // @todo, this is not safe, content is displayed if authorized is a promise
	} )
	
	return { loading, authorized }
}



class App extends Component
{
	
	render()
	{
		return (
			<AuthProvider>
				<div className="App">
					<Header/>
					
					<main className="p-4">
						<Router>
							<HomePage
								path="/"
							/>
							
							<LoginPage
								path="/login"
							/>
							
							<LogoutPage
								path="/logout"
							/>
							
							<NotFoundPage default/>
						</Router>
					</main>
				</div>
			</AuthProvider>
		);
		
	}
}


export default App;



