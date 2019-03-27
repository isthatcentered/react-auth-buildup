import "../index.scss"
import React, { HTMLAttributes, InputHTMLAttributes } from "react"
import { storiesOf } from "@storybook/react"
import { LoginOrSignup } from "../LoginOrSignup"
//@ts-ignore
import { action } from "@storybook/addon-actions";




function Display( { children }: HTMLAttributes<HTMLDivElement> )
{
	return <div className="min-h-screen flex items-center justify-center">{children}</div>
}


export interface InputProps extends InputHTMLAttributes<HTMLInputElement>
{

}


export function Input( { style = {}, className = "", children, ...props }: InputProps )
{
	
	return (
		<label className="block text-grey-darker font-bold">
			<span className="mb-2 block">{children}</span>
			<input
				{...props}
				style={{ ...style }}
				className={`${className} Input shadow appearance-none border rounded w-full p-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline`}
			/>
		</label>
	)
}


storiesOf( "Input", module )
	.add( "Default", () => (
		<Display>
			<Input
				type="email"
				placeholder="email"
			>
				Email
			</Input>
		</Display>) )


storiesOf( "LoginOrSignup", module )
	.add( "Default", () => (
		<Display>
			<LoginOrSignup
				tab="login"
				onClickSwitchTab={action( "Switch tab" )}
				onAuthSubmit={action( "Submit" )}
			/>
		</Display>) )



/*
import { Alert } from "../Random"

import { LoginOrSignupProps, LoginOrSignup } from "../AuthenticationPage/LogInOrSignup"
//@ts-ignore
// import { linkTo } from "@storybook/addon-links";




storiesOf( "Alert", module )
	.add( "Success", () => (
		<Display>
			<Alert type="success"> You did it! 🥳</Alert>
		</Display>) )
	
	.add( "Error", () => (
		<Display>
			<Alert type="error"> You did it 🥺</Alert>
		</Display>) )

storiesOf( "LoginOrSignup", module )
	.add( "Logging in", () =>
		makeAuthPageView( { tab: "login" } ) )
	
	.add( "Signing up", () =>
		makeAuthPageView( { tab: "signup" } ) )
	
	.add( "Processing", () =>
		makeAuthPageView( { loading: true } ) )
	
	.add( "Processed with error", () =>
		makeAuthPageView( {
			alert: {
				type:    "error",
				message: "Nope, unauthorized 💩",
			},
		} ) )
	
	.add( "Processed success", () =>
		makeAuthPageView( {
			alert: {
				type:    "success",
				message: "Yay, you're in! 🥳",
			},
		} ) )
	
	.add( "Re-submit", () =>
		makeAuthPageView( {
			loading: true,
			alert:   {
				type:    "error",
				message: "Nope, unauthorized  💩",
			},
		} ) )


function makeAuthPageView( props: Partial<LoginOrSignupProps> = {} )
{
	const safeProps: LoginOrSignupProps = {
		tab:         "login",
		loading:        false,
		alert:          undefined,
		onAuthenticate: tab( "submit" ),
		...props as any, // we enforced states, ts doesn't like mixing in Partial<props>
	}
	
	return <Display><LoginOrSignup {...safeProps}  /></Display>
}
*/