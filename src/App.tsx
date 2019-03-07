import React, { Component } from "react";
import "./App.css";
import { stringify } from "query-string"
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
				{!authprovider.isAuthenticated ?
				 <LoginForm authProvider={authprovider}/> :
				 <p>Logged in 🥳</p>}
			</div>
		);
	}
	
	
	private _authLink(): string
	{
		const params: string = stringify( {
			response_type: `token`,
			grant_type:    `implicit`,
			client_id:     `a2909cb9-1b26-41af-be34-67bf405872f7`,
			redirect_uri:  `http://localhost:3000`,
			scope:         `https://graph.microsoft.com/Calendars.ReadWrite`,
		} )
		
		
		return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
	}
}

export default App;


