import * as React from "react"
import { Component, Context, createContext } from "react"




export interface Credentials
{
	email: string,
	password: string
}

interface AuthorizationProvider
{
	readonly isAuthenticated: boolean
	
	logout(): void
	
	authenticate( credentials: Credentials ): boolean
}


export const AuthContext: Context<AuthorizationProvider> = createContext<AuthorizationProvider>( {
	isAuthenticated: false,
	authenticate:    () => false,
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
