import * as React from "react"
import { HTMLAttributes, useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import { authCredentials, Gatekeeper } from "./Gatekeeper"
import { AuthenticationForm } from "./AuthenticationForm"
import { TabButton, TabPanel } from "./Tab"




export interface AuthPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	gatekeeper: Gatekeeper
}


export function AuthPage( { gatekeeper, navigate, location, style = {}, className = "", children, ...props }: AuthPageProps )
{
	const [ tab, setTab ] = useState<"login" | "signup">( "login" )
	
	const activeStyles: string[]   = [ "bg-white", "text-blue-darker", "border-transparent" ],
	      inactiveStyles: string[] = [ "text-grey-darkest", "border-grey-lighter" ]
	
	useEffect( () => {
		if ( gatekeeper.authenticated() )
			navigate!( "/" )
	} )
	
	
	function handleLogin( credentitals: authCredentials )
	{
		gatekeeper.login( credentitals )
			.then( () => navigate!( "/" ) )
	}
	
	
	function handleSignup( credentitals: authCredentials )
	{
		gatekeeper.signup( credentitals )
			.then( () => navigate!( "/" ) )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthPage flex items-center justify-center min-h-screen`}
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
								onAuthenticate={handleLogin}
								cta="Log me in"
							/>
						</TabPanel>
						
						<TabPanel active={tab === "signup"}>
							<AuthenticationForm
								onAuthenticate={handleSignup}
								cta="Sign me up"
							/>
						</TabPanel>
					</div>
				</div>
			</section>
		</div>)
}


