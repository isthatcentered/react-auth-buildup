import React, { Component, HTMLAttributes, useContext, useEffect } from "react";
import "./App.css";
import { Header } from "./Header"
import { RouteComponentProps, Router } from "@reach/router"
import { AuthContext, AuthProvider } from "./AuthContext"
import { LoginPage } from "./LoginPage"
import { HomePage } from "./HomePage"




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


export interface LogoutPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{

}


export function LogoutPage( { navigate, location, style = {}, className = "", children, ...props }: LogoutPageProps )
{
	// call destroy session
	
	// navigate to home
	const authProvider = useContext( AuthContext )
	
	useEffect( () => {
		authProvider.logout()
			.then( () => {
				navigate!( "/login" )
			} )
	} )
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LogoutPage`}
		>
			Logging out... 👨‍🚀
		</div>
	)
}


export interface NotFoundPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{

}


export function NotFoundPage( { navigate, location, style = {}, className = "", children, ...props }: NotFoundPageProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} NotFoundPage`}
		>
			<h1 style={{ fontSize: "120px" }}>🤷‍♂️</h1>
			(page not found)
		</div>
	)
}


export default App;



