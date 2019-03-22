import * as React from "react"
import { HTMLAttributes, useState } from "react"
import { TabButton, TabPanel } from "./Tab"
import { AuthenticationForm } from "./AuthenticationForm"
import { authCredentials } from "./Gatekeeper"




export interface LoginOrSignupProps extends HTMLAttributes<HTMLDivElement>
{
	onLogin( credentials: authCredentials ): any
	
	onSignup( credentials: authCredentials ): any
}


export function LoginOrSignup( { onLogin, onSignup, style = {}, className = "", children, ...props }: LoginOrSignupProps )
{
	const [ tab, setTab ] = useState<"login" | "signup">( "login" )
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginOrSignup`}
		>
			<section className="w-full max-w-xs">
				<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-hidden">
					
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
								onAuthenticate={onLogin}
								cta="Log me in"
							/>
						</TabPanel>
						
						<TabPanel active={tab === "signup"}>
							<AuthenticationForm
								onAuthenticate={onSignup}
								cta="Sign me up"
							/>
						</TabPanel>
					</div>
				</div>
			</section>
		</div>
	)
}
