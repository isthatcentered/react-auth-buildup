import * as React from "react"
import { Component, Context, createContext } from "react"
import { API } from "./api"
import { ApiError } from "../api/src/contracts"




export interface Credentials
{
	email: string,
	password: string
}

interface AuthorizationProvider
{
	readonly isAuthenticated: boolean
	
	logout(): Promise<void>
	
	authenticate( credentials: Credentials ): Promise<boolean>
}


export const AuthContext: Context<AuthorizationProvider> = createContext<AuthorizationProvider>( {
	isAuthenticated: false,
	authenticate:    () => Promise.resolve( false ),
	logout:          () => Promise.reject(),
} )

export interface CustomAuthContextProviderProps
{
}

interface CustomAuthContextProviderState
{
	isAuthenticated: boolean
}

export class CustomAuthContextProvider extends Component<CustomAuthContextProviderProps, CustomAuthContextProviderState>
{
	
	state: CustomAuthContextProviderState = {
		isAuthenticated: this._hasToken(),
	}
	
	
	logout()
	{
		return API.delete( `/session` )
			.then( () => undefined ) // Typescript yells without the "then"
			.catch( ( { response: { data } } ) => {
				throw new Error( (data as ApiError).message )
			} )
			.finally( () => {
				this._clearToken()
			} )
	}
	
	
	login( credentials: Credentials ): Promise<boolean>
	{
		return API.post( `/session`, {
				...credentials,
			} )
			.then( ( { data: { token } } ) => {
				this._setToken( token )
				console.log( token )
				return this._isAuthenticated()
			} )
			.catch( ( { response: { data } } ) => {
				this._clearToken()
				throw new Error( (data as ApiError).message )
			} )
	}
	
	
	private _isAuthenticated(): boolean
	{
		return !!this._getToken()
	}
	
	
	private _clearToken(): void
	{
		this._setToken( "" )
	}
	
	
	private _hasToken(): boolean
	{
		return !!this._getToken()
	}
	
	
	private _setToken( value: string ): void
	{
		localStorage.setItem( "token", value )
		
		this.setState( { isAuthenticated: this._isAuthenticated() } )
	}
	
	
	private _getToken(): string
	{
		return localStorage.getItem( "token" ) || ""
	}
	
	
	
	componentDidMount()
	{
	}
	
	
	render()
	{
		return (
			<AuthContext.Provider
				value={{
					...this.state,
					logout:       this.logout.bind( this ),
					authenticate: this.login.bind( this ),
				}}
			>
				{this.props.children}
			</AuthContext.Provider>)
	}
}

export const AuthProvider = CustomAuthContextProvider
