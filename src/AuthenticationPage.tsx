import * as React from "react"
import { HTMLAttributes, useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import { authCredentials, Gatekeeper } from "./Gatekeeper"
import { AuthenticationForm } from "./AuthenticationForm"




export interface AuthPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
	gatekeeper: Gatekeeper
}


export function AuthPage( { gatekeeper, navigate, location, style = {}, className = "", children, ...props }: AuthPageProps )
{
	const [ tab, setTab ] = useState<"login" | "signup">( "login" )
	
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
				<nav>
					<ul>
						<li>
							<button onClick={() => setTab( "login" )}>Login</button>
						</li>
						<li>
							<button onClick={() => setTab( "signup" )}>Signup</button>
						</li>
					</ul>
				</nav>
				
				{(() => {
					switch ( tab ) {
						case "login":
							return (
								<AuthenticationForm
									onAuthenticate={handleLogin}
									cta="Log me in"
								/>)
						
						case "signup":
							return (
								<AuthenticationForm
									onAuthenticate={handleSignup}
									cta="Sign me up"
								/>)
						
						default:
							const ensureAllCasesHandled: never = tab
					}
				})()}
			
			</section>
		</div>
	)
}


