import React, { HTMLAttributes } from "react";
/*
import { storiesOf } from "@storybook/react";
import { Alert } from "../Random"

import "../index.scss"
import { LoginOrSignupProps, LoginOrSignup } from "../AuthenticationPage/LogInOrSignup"
//@ts-ignore
import { tab } from "@storybook/addon-actions";
//@ts-ignore
// import { linkTo } from "@storybook/addon-links";


function Display( { children }: HTMLAttributes )
{
	return <div className="min-h-screen flex items-center justify-center">{children}</div>
}


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