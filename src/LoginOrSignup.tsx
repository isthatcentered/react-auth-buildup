import * as React from "react"
import { FormEvent, HTMLAttributes } from "react"
import { credentials } from "./AuthPage"




export interface LoginOrSignupProps extends HTMLAttributes<HTMLDivElement>
{
	tab: "login" | "signup"
	onClickSwitchTab: ( tab: this["tab"] ) => void
	onAuthSubmit: ( type: this["tab"], credentials: credentials ) => Promise<void>
}


export function LoginOrSignup( { onClickSwitchTab, onAuthSubmit, tab, style = {}, className = "", children, ...props }: LoginOrSignupProps )
{
	const safeTab = sanitizeTab( tab )
	
	function handleSubmit( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		const data     = new FormData( e.target as HTMLFormElement ),
		      email    = data.get( "email" ) as string | undefined,
		      password = data.get( "password" ) as string | undefined
		
		if ( !email || !password )
			return
		
		onAuthSubmit( safeTab, { email, password } )
	}
	
	
	function sanitizeTab( tab: string ): LoginOrSignupProps["tab"]
	{
		return tab !== "login" && tab !== "signup" ?
		       "login" :
		       tab
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginOrSignup`}
		>
			
			<button onClick={() => onClickSwitchTab( "login" )}>
				Login
			</button>
			
			<button onClick={() => onClickSwitchTab( "signup" )}>
				Signup
			</button>
			
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input type="email"
					       name="email"
					       placeholder="Email"/>
				</label>
				
				<label>
					Password
					<input type="password"
					       name="password"
					       placeholder="Password"/>
				</label>
				
				<button type="submit">
					{safeTab === "signup" ?
					 "Sign me up" :
					 "Log me in"}
				</button>
			</form>
		</div>
	)
}