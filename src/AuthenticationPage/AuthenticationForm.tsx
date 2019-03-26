import * as React from "react"
// import { Button, Input, Label, LabelText } from "../Random"
// import * as React from "react"
// import { FormEvent, HTMLAttributes } from "react"
//
//
//
//
// export type authenticationCredentials = {
// 	email: string
// 	password: string
// }
//
// export interface AuthenticationFormProps
// {
// 	processing: boolean
// 	cta: string
// 	onAuthenticate: ( credentials: authenticationCredentials ) => any
// }
//
//
// export function AuthenticationForm( { onAuthenticate, cta, processing, style = {}, className = "", children, ...props }: AuthenticationFormProps & HTMLAttributes<HTMLDivElement> )
// {
//
// 	function handleSubmit( e: FormEvent<HTMLFormElement> )
// 	{
// 		e.preventDefault()
//
// 		const data     = new FormData( e.target as HTMLFormElement ),
// 		      email    = data.get( "email" ) as string | undefined,
// 		      password = data.get( "password" ) as string | undefined
//
// 		if ( !email || !password )
// 			return
//
// 		onAuthenticate( { email, password } )
// 	}
//
//
// 	return (
// 		<div
// 			{...props}
// 			style={{ ...style }}
// 			className={`${className} AuthenticationForm`}
// 		>
// 			<form
// 				onSubmit={handleSubmit}
// 				className="p-8"
// 			>
// 				<Label className="mb-8">
// 					<LabelText className="mb-4">Email</LabelText>
// 					<Input name="email"
// 					       type="email"/>
// 				</Label>
//
// 				<Label className="mb-8">
// 					<LabelText className="mb-4">Password</LabelText>
// 					<Input name="password"
// 					       type="password"/>
// 				</Label>
//
//
// 				<Button type="submit"
// 				        disabled={processing}>
// 					{cta}
// 				</Button>
// 			</form>
// 		</div>
// 	)
// }