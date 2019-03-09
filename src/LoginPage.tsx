import React, { HTMLAttributes, useContext, useEffect, useState } from "react"
import { AuthContext, Credentials } from "./AuthContext"
import { LoginForm } from "./LoginForm"
import { RouteComponentProps } from "@reach/router"




export interface LoginPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
}


export function LoginPage( { style = {}, className = "", children, navigate, location, ...props }: LoginPageProps )
{
	const authProvider        = useContext( AuthContext ),
	      [ error, setError ] = useState( "" )
	
	useEffect( () => {
		if ( authProvider.isAuthenticated )
			navigate!( "/" )
	} )
	
	
	function handleLogin( credentials: Credentials )
	{
		authProvider
			.authenticate( credentials )
			.catch( ( { message }: Error ) => setError( message ) )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginPage`}
		>
			{error && (
				<div className="p-4 border border-red bg-red-lightest text-red font-bold mb-4">
					😱 {error}
				</div>)}
			
			<LoginForm
				onLogin={handleLogin}
			/>
		</div>
	)
}