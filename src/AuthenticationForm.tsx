import * as React from "react"
import { FormEvent, HTMLAttributes } from "react"
import { Button, Input, Label, LabelText } from "./Random"
import { authCredentials } from "./Gatekeeper"




export interface AuthenticationFormProps extends HTMLAttributes<HTMLDivElement>
{
	onAuthenticate( credentials: authCredentials ): any
	
	children?: undefined
	
	cta?: string
}


export function AuthenticationForm( { cta = "go", onAuthenticate, style = {}, className = "", children, ...props }: AuthenticationFormProps )
{
	function handleSubmit( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		const data     = new FormData( e.target as HTMLFormElement ),
		      email    = data.get( "email" ) as string,
		      password = data.get( "password" ) as string
		
		if ( !password || !email )
			return
		
		onAuthenticate( { email, password } )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationForm`}
		>
			<form
				onSubmit={handleSubmit}
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			>
				<Label className="mb-4">
					<LabelText>Email</LabelText>
					<Input type="email"
					       name="email"/>
				</Label>
				
				<Label className="mb-4">
					<LabelText>Password</LabelText>
					<Input type="password"
					       name="password"/>
				</Label>
				
				<Button type="submit">{cta}</Button>
			</form>
		
		</div>
	)
}