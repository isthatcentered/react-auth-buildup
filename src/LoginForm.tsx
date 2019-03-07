import React, { FormEvent, HTMLAttributes, useState } from "react"
import { Credentials } from "./AuthContext"
import { Button } from "./Random"




export interface LoginFormProps extends HTMLAttributes<HTMLDivElement>
{
	onLogin: ( credentials: Credentials ) => any
}


export function LoginForm( { onLogin, style = {}, className = "", children, ...props }: LoginFormProps )
{
	
	const [ email, setEmail ]       = useState( "" ),
	      [ password, setPassword ] = useState( "" )
	
	
	
	function handleSubmit( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		onLogin( { email, password } )
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
				
				<Button
					type="submit"
				>
					Log In
				</Button>
			</form>
		</div>
	)
}