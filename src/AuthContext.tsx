import * as React from "react"
import { Component, Context, createContext } from "react"
import Axios from "axios"




export interface Credentials
{
	email: string,
	password: string
}

interface AuthorizationProvider
{
	readonly isAuthenticated: boolean
	
	logout(): void
	
	authenticate( credentials: Credentials ): Promise<boolean>
}


export const AuthContext: Context<AuthorizationProvider> = createContext<AuthorizationProvider>( {
	isAuthenticated: false,
	authenticate:    () => Promise.resolve( false ),
	logout:          () => undefined,
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
		this._setIsAuthenticated( false )
	}
	
	
	authenticate( credentials: Credentials ): Promise<boolean>
	{
		return Axios.post( `/api/authenticate`, {
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
					authenticate: this.authenticate.bind( this ),
				}}
			>
				{this.props.children}
			</AuthContext.Provider>)
	}
}

export const AuthProvider = CustomAuthContextProvider
