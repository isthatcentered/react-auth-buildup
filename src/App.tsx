import React, { Component, HTMLAttributes, useContext, useEffect } from "react";
import "./App.css";
import { LoginForm } from "./LoginForm"
import { Header } from "./Header"
import { RouteComponentProps, Router } from "@reach/router"
import { AuthContext, AuthProvider, Credentials, ObservableAuthorizationProvider } from "./AuthContext"




class App extends Component
{
	componentDidMount(): void
	{
		// this.authprovider.subscribe( () => this.forceUpdate() )
	}
	
	
	render()
	{
		return (
			<AuthProvider value={new ObservableAuthorizationProvider()}>
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
						</Router>
					</main>
				</div>
			</AuthProvider>
		);
		
	}
	
}

export default App;



export interface HomePageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
}


export function HomePage( { style = {}, className = "", children, navigate, location, ...props }: HomePageProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} HomePage`}
		>
			'sup! 🥳
		</div>
	)
}


export interface LoginPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
}


export function LoginPage( { style = {}, className = "", children, navigate, location, ...props }: LoginPageProps )
{
	const authProvider = useContext( AuthContext )
	
	useEffect( () => {
		if ( authProvider.isAuthenticated )
			navigate!( "/" )
	} )
	
	
	function handleLogin( credentials: Credentials )
	{
		authProvider.authenticate( credentials )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginPage`}
		>
			<LoginForm
				onLogin={handleLogin}
			/>
		</div>
	)
}
