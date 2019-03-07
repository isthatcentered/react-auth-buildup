import React, { Component, HTMLAttributes } from "react";
import "./App.css";
import { LoginForm } from "./LoginForm"




export class AuthProvider
{
	
	private _isAuthenticated: boolean = false
	
	private _subscribers: Array<() => any> = []
	
	
	get isAuthenticated()
	{
		return this._isAuthenticated
	}
	
	
	set isAuthenticated( value: boolean )
	{
		this._isAuthenticated = value
		
		this._notify()
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

export const authprovider = new AuthProvider()

export interface Credentials
{
	email: string,
	password: string
}

class App extends Component
{
	
	componentDidMount(): void
	{
		authprovider.subscribe( () => this.forceUpdate() )
	}
	
	
	render()
	{
		return (
			<div className="App">
				
				<Header authProvider={authprovider}/>
				
				<main className="p-4">
					{!this.isLoggedIn() ?
					 <LoginForm authProvider={authprovider}/> :
					 <p className="text-xl">🥳</p>
					}
				</main>
			</div>
		);
	}
	
	
	private isLoggedIn()
	{
		return authprovider.isAuthenticated
	}
}

export default App;


export interface HeaderProps extends HTMLAttributes<HTMLDivElement>
{
	authProvider: AuthProvider
}


export function Header( { authProvider, style = {}, className = "", children, ...props }: HeaderProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Header flex p-4 bg-purple`}
		>
			<div className="ml-auto">
				{!authprovider.isAuthenticated ?
				 <a href="/login">Log in</a> :
				 <p>Logged in 🥳</p>}
			</div>
		</div>
	)
}
