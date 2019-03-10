import * as React from "react"
import { Component, Context, createContext } from "react"
import { API } from "./api"




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
		isAuthenticated: this._getIsAuthenticated(),
	}
	
	
	logout()
	{
		return API.delete( `/session` )
			.then( () =>
				this._setIsAuthenticated( false ) )
			.catch( ( { response: { data } } ) => {
				throw new Error( data.message )
			} )
			.finally( () => this._setIsAuthenticated( false ) )
	}
	
	
	login( credentials: Credentials ): Promise<boolean>
	{
		return API.post( `/session`, {
				...credentials,
			} )
			.then( res => {
				this._setIsAuthenticated( true )
				
				return this._getIsAuthenticated()
			} )
			.catch( ( { response: { data } } ) => {
				throw new Error( data.message )
			} )
	}
	
	
	private _setIsAuthenticated( value: boolean )
	{
		localStorage.setItem( "isAuthenticated", value.toString() )
		
		this.setState( { isAuthenticated: value } )
	}
	
	
	private _getIsAuthenticated()
	{
		return JSON.parse( localStorage.getItem( "isAuthenticated" ) || "false" )
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
