import * as React from "react"
import { Component, Context, createContext } from "react"
import { API } from "./api"
import { ApiError } from "../api/src/contracts"
import { Pass } from "../api/src/Routes/sessions"




export interface Credentials
{
	email: string,
	password: string
}

export interface AuthorizationProvider
{
	readonly isAuthenticated: boolean
	
	logout(): Promise<void>
	
	authenticate( credentials: Credentials ): Promise<boolean>
	
	getAuthHeader(): { authorization: string } | {}
}


export const AuthContext: Context<AuthorizationProvider> = createContext<AuthorizationProvider>( {
	isAuthenticated: false,
	authenticate:    () => Promise.resolve( false ),
	logout:          () => Promise.reject(),
	getAuthHeader:   () => ({}),
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
		isAuthenticated: this._isAuthenticated(),
	}
	
	
	logout()
	{
		this._clearPass()// Not much we can do to invalidate token on backend side
		
		return Promise.resolve()
	}
	
	
	login( credentials: Credentials ): Promise<boolean>
	{
		return API.post<Pass>( `/session`, {
				...credentials,
			} )
			.then( ( { data } ) => {
				
				this._setPass( data )
				
				console.log( data )
				
				return this._isAuthenticated()
			} )
			.catch( ( { response: { data } } ) => {
				this._clearPass()
				
				throw new Error( (data as ApiError).message )
			} )
	}
	
	
	private _isAuthenticated(): boolean
	{
		const { token, expiresAt } = this._getPass(),
		      hasToken             = !!token,
		      tokenExpired         = new Date().getTime() >= expiresAt
		
		return hasToken && !tokenExpired
	}
	
	
	private _clearPass(): void
	{
		localStorage.setItem( "pass", "null" )
		
		this.setState( state => ({
			isAuthenticated: false,
		}) )
	}
	
	
	private _setPass( pass: Pass ): void
	{
		localStorage.setItem( "pass", JSON.stringify( {
			...pass,
			expiresAt: pass.expiresAt * 1000, // Exp value from token is UNIX timestamp––the number of SECONDS since Jan 1, 1970. JS,is UNIX timestamp in MILLISECONDS
		} ) )
		
		this.setState( state => ({
			isAuthenticated: this._isAuthenticated(),
		}) )
	}
	
	
	private _getPass(): Pass
	{
		const stored = JSON.parse( localStorage.getItem( "pass" ) || "null" )
		
		const visitorPass = { token: "", expiresAt: Date.now(), userInfo: { email: "" } }
		
		return stored || visitorPass
	}
	
	
	getAuthHeader()
	{
		const { token } = this._getPass()
		
		return this._getPass().token ?
		       { authorization: `Bearer ${token}` } :
		       {}
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
					logout:        this.logout.bind( this ),
					authenticate:  this.login.bind( this ),
					getAuthHeader: this.getAuthHeader.bind( this ),
				}}
			>
				{this.props.children}
			</AuthContext.Provider>)
	}
}

export const AuthProvider = CustomAuthContextProvider
