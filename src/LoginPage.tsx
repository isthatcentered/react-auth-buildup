import React, { HTMLAttributes, useContext, useEffect, useState } from "react"
import { AuthContext, Credentials } from "./AuthContext"
import { LoginForm } from "./LoginForm"
import { RouteComponentProps } from "@reach/router"
import { ErrorAlert } from "./Random"




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
			{error && <ErrorAlert>{error}</ErrorAlert>}
			
			<LoginForm
				onLogin={handleLogin}
			/>
		</div>
	)
}


export interface ErrorProps extends HTMLAttributes<HTMLDivElement>
{

}


