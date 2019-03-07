import React, { Component, HTMLAttributes, useEffect } from "react";
import "./App.css";
import { LoginForm } from "./LoginForm"
import { Header } from "./Header"
import { RouteComponentProps, Router } from "@reach/router"




export class AuthProvider
{
	
	private _subscribers: Array<() => any> = []
	
	
	get isAuthenticated()
	{
		return this._getIsAuthenticated()
	}
	
	
	logout()
	{
		this._setIsAuthenticated( false )
		
		this._notify()
	}
	
	
	
	authenticate( credentials: Credentials ): boolean
	{
		function isValidUser( { email, password }: Credentials )
		{
			const users: Credentials[] = [ { email: "admin", password: "admin" } ],
			      hasMatch             = !!users.find( u => u.email === email && u.password === password )
			
			return hasMatch
		}
		
		
		this._setIsAuthenticated( isValidUser( credentials ) )
		
		return this._getIsAuthenticated()
	}
	
	
	private _setIsAuthenticated( value: boolean )
	{
		localStorage.setItem( "isAuthenticated", value.toString() )
		
		this._notify()
	}
	
	
	private _getIsAuthenticated()
	{
		return JSON.parse( localStorage.getItem( "isAuthenticated" ) || "false" )
	}
	
	
	subscribe( callback: () => any )
	{
		this._subscribers.push( callback )
	}
	
	
	private _notify()
	{
		this._subscribers.forEach( fn => fn() )
	}
}


export interface Credentials
{
	email: string,
	password: string
}

class App extends Component
{
	authprovider: AuthProvider = new AuthProvider()
	
	
	componentDidMount(): void
	{
		this.authprovider.subscribe( () => this.forceUpdate() )
	}
	
	
	render()
	{
		return (
			<div className="App">
				
				<Header authProvider={this.authprovider}/>
				
				<main className="p-4">
					<Router>
						<HomePage authProvider={this.authprovider}
						          path="/"/>
						<LoginPage authProvider={this.authprovider}
						           path="/login"/>
					</Router>
				</main>
			</div>
		);
	}
}

export default App;



export interface HomePageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	authProvider: AuthProvider
}


export function HomePage( { authProvider, style = {}, className = "", children, navigate, location, ...props }: HomePageProps )
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
	authProvider: AuthProvider
}


export function LoginPage( { authProvider, style = {}, className = "", children, navigate, location, ...props }: LoginPageProps )
{
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
				authProvider={authProvider}
				onLogin={handleLogin}
			/>
		</div>
	)
}
