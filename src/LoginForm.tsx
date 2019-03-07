import React, { FormEvent, HTMLAttributes, useState } from "react"
import { AuthProvider, authprovider, Credentials } from "./App"




export interface LoginFormProps extends HTMLAttributes<HTMLDivElement>
{
	authProvider: AuthProvider
}


export function LoginForm( { style = {}, className = "", children, ...props }: LoginFormProps )
{
	
	const [ email, setEmail ]       = useState( "" ),
	      [ password, setPassword ] = useState( "" )
	
	
	function isValidUser( { email, password }: Credentials )
	{
		const users: Credentials[] = [ { email: "admin", password: "admin" } ],
		      hasMatch             = users.find( u => u.email === email && u.password === password )
		
		return hasMatch
	}
	
	
	function handleSubmit( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		return isValidUser( { email: email, password } ) ?
		       authprovider.isAuthenticated = true :
		       authprovider.isAuthenticated = true
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LoginForm`}
		>
			<form onSubmit={handleSubmit}>
				<label>
					<input
						autoFocus
						type="text"
						placeholder="email"
						name="email"
						value={email}
						onChange={e => setEmail( e.target.value )}
					/>
				</label>
				<label>
					<input
						type="password"
						placeholder="password"
						name="password"
						value={password}
						onChange={e => setPassword( e.target.value )}
					/>
				</label>
				<button type="submit">Log In</button>
			</form>
		</div>
	)
}