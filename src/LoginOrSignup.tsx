import * as React from "react"
import { HTMLAttributes, useState } from "react"
import { TabButton, TabPanel } from "./Tab"
import { AuthenticationForm } from "./AuthenticationForm"
import { authCredentials } from "./Gatekeeper"




export type alertkind = "success" | "error"

export interface AlertProps extends HTMLAttributes<HTMLDivElement>
{
	type: alertkind
	children: any
}


export function Alert( { type, style = {}, className = "", children, ...props }: AlertProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Alert`}
		>
			{children}
		</div>
	)
}


export interface LoginOrSignupProps extends HTMLAttributes<HTMLDivElement>
{
	onLogin( credentials: authCredentials ): Promise<void>
	
	onSignup( credentials: authCredentials ): Promise<void>
}


export function LoginOrSignup( { onLogin, onSignup, style = {}, className = "", children, ...props }: LoginOrSignupProps )
{
	const [ tab, setTab ]         = useState<"login" | "signup">( "login" ),
	      [ message, setMessage ] = useState<string>()
	
	
	function handleAction( type: "login" | "signup", credentials: authCredentials )
	{
		if ( type === "login" )
			onLogin( credentials )
				.then( () => setMessage( "Success" ) )
		
		if ( type === "signup" )
			onSignup( credentials )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginOrSignup`}
		>
			<section className="w-full max-w-xs">
				<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-hidden">
					
					{message && (
						<Alert type={"success"}>
							{message}
						</Alert>)}
					
					
					<nav className="mb-6">
						<ul className="list-reset -mx-8 -mt-6 flex bg-grey-lightest">
							<li className="w-1/2">
								<TabButton
									active={tab === "login"}
									onTrigger={() => setTab( "login" )}
								>
									Login
								</TabButton>
							</li>
							<li className="w-1/2 ">
								<TabButton
									active={tab === "signup"}
									onTrigger={() => setTab( "signup" )}
								>
									Signup
								</TabButton>
							</li>
						</ul>
					</nav>
					<div>
						<TabPanel active={tab === "login"}>
							<AuthenticationForm
								onAuthenticate={creds => handleAction( "login", creds )}
								cta="Log me in"
							/>
						</TabPanel>
						
						<TabPanel active={tab === "signup"}>
							<AuthenticationForm
								onAuthenticate={creds => handleAction( "signup", creds )}
								cta="Sign me up"
							/>
						</TabPanel>
					</div>
				</div>
			</section>
		</div>
	)
}
