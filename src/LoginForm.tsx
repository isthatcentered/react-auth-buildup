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
				
				<h2 className="text-purple">Login</h2>
				
				<div className="pt-4"/>
				
				<label
					className="block"
				>
					<input
						autoFocus
						type="text"
						placeholder="Email"
						name="email"
						value={email}
						onChange={e => setEmail( e.target.value )}
						className="border rounded px-3 py-2"
					/>
				</label>
				
				<div className="pt-4"/>
				
				<label
					className="block"
				>
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={e => setPassword( e.target.value )}
						className="border rounded px-3 py-2"
					/>
				</label>
				
				<div className="pt-4"/>
				
				<button
					className="rounded border px-3 py-2 bg-purple text-white border-purple-dark"
					type="submit">Log In
				</button>
			</form>
		</div>
	)
}