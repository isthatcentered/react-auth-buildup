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

export class ObservableAuthorizationProvider implements AuthorizationProvider
{
	
	private _subscribers: Array<() => any> = []
	
	
	get isAuthenticated(): boolean
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

export const AuthContext: Context<AuthorizationProvider> = createContext<AuthorizationProvider>( new ObservableAuthorizationProvider() )

export interface CustomAuthContextProviderProps
{
	value: ObservableAuthorizationProvider
}

export class CustomAuthContextProvider extends Component<CustomAuthContextProviderProps, any>
{
	
	
	componentDidMount()
	{
		this.props.value.subscribe( () => this.forceUpdate() )
	}
	
	
	render()
	{
		const { value: provider } = this.props
		return (
			<AuthContext.Provider value={{
				isAuthenticated: provider.isAuthenticated,
				logout(): void
				{
					provider.logout()
				},
				authenticate( credentials: Credentials ): boolean
				{
					return provider.authenticate( credentials )
				},
			}}>
				{this.props.children}
			</AuthContext.Provider>)
	}
}


export const { Consumer: AuthConsumer } = AuthContext
export const AuthProvider = CustomAuthContextProvider
