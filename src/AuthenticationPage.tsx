import * as React from "react"
import { FormEvent, HTMLAttributes, useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import { object } from "testdouble"
import { Gatekeeper } from "./Gatekeeper"




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
	
	
	function handleLogin( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		const data     = new FormData( e.target as HTMLFormElement ),
		      email    = data.get( "email" ) as string,
		      password = data.get( "password" ) as string
		
		gatekeeper.login( { email, password } )
			.then( () => navigate!( "/" ) )
	}
	
	
	function handleSignup( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		const data     = new FormData( e.target as HTMLFormElement ),
		      email    = data.get( "email" ) as string,
		      password = data.get( "password" ) as string
		
		gatekeeper.signup( { email, password } )
			.then( () => navigate!( "/" ) )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthPage`}
		>
			
			<section>
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
								<div>
									<form onSubmit={handleLogin}>
										<label>
											Email
											<input type="email"
											       name="email"/>
										</label>
										
										<label>
											Password
											<input type="password"
											       name="password"/>
										</label>
										
										<button type="submit">Log me in</button>
									</form>
								</div>)
						
						case "signup":
							return (
								<div>
									<form onSubmit={handleSignup}>
										<label>
											Email
											<input type="email"
											       name="email"/>
										</label>
										
										<label>
											Password
											<input type="password"
											       name="password"/>
										</label>
										
										<button type="submit">Sign me up</button>
									</form>
								</div>)
						
						default:
							const ensureAllCasesHandled: never = tab
					}
				})()}
			
			</section>
		</div>
	)
}


