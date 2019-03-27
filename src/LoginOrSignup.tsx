import * as React from "react"
import { FormEvent, HTMLAttributes } from "react"
import { credentials } from "./AuthPage"
import { Input } from "./stories/index.stories"
import { Button } from "./Random"




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
			className={`${className} LoginOrSignup bg-white rounded shadow-md overflow-hidden`}
			style={{ ...style, width: 440, maxWidth: "100%" }}
		>
			
			<nav>
				<ul className="list-reset flex justify-center text-center mb-8">
					<li className="flex-grow">
						<TabButton active={tab === "login"}
						           onClick={() => onClickSwitchTab( "login" )}
						>
							Login
						</TabButton>
					</li>
					<li className="flex-grow">
						<TabButton active={tab === "signup"}
						           onClick={() => onClickSwitchTab( "signup" )}
						>
							Signup
						</TabButton>
					</li>
				</ul>
			</nav>
			
			<form className="px-8 pb-8"
			      onSubmit={handleSubmit}
			>
				<Input type="email"
				       name="email"
				       placeholder="Email"
				       className="mb-4"
				>
					Email
				</Input>
				
				<Input type="password"
				       name="password"
				       placeholder="Password"
				       className="mb-8"
				>
					Password
				</Input>
				
				<Button type="submit">
					{safeTab === "signup" ?
					 "Sign me up" :
					 "Log me in"}
				</Button>
			</form>
		</div>
	)
}



interface TabButtonProps extends HTMLAttributes<HTMLDivElement>
{
	active: boolean
}


function TabButton( { active, style = {}, className = "", children, ...props }: TabButtonProps )
{
	
	const styles = active ?
	               [ "font-bold" ] :
	               [ "border", "border-grey-lighter", "bg-grey-lightest" ]
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} TabButton`}
		>
			<button className={`p-4 w-full text-grey-darker ${styles.join( " " )}`}>
				{children}
			</button>
		</div>
	)
}
