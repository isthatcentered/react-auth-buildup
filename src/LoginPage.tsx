import React, { HTMLAttributes, useContext, useEffect } from "react"
import { AuthContext, Credentials } from "./AuthContext"
import { LoginForm } from "./LoginForm"
import { RouteComponentProps } from "@reach/router"




export interface LoginPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
}


export function LoginPage( { style = {}, className = "", children, navigate, location, ...props }: LoginPageProps )
{
	const authProvider = useContext( AuthContext )
	
	useEffect( () => {
		if ( authProvider.isAuthenticated )
			navigate!( "/" )
	} )
	
	
	function handleLogin( credentials: Credentials )
	{
		authProvider.authenticate( credentials )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginPage`}
		>
			<LoginForm
				onLogin={handleLogin}
			/>
		</div>
	)
}