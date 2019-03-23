import React from "react";

import { storiesOf } from "@storybook/react";
import { Alert } from "../Random"

import "../index.scss"
import { AuthenticationPageView, AuthenticationPageViewProps } from "../AuthenticationPage/View"
//@ts-ignore
import { action } from "@storybook/addon-actions";
//@ts-ignore
// import { linkTo } from "@storybook/addon-links";


// Next
// is
// testing
// validate( creds ).then().catch
// or
// try catch
// 	?
// 	form
// 	is
// disabled
// when
// loading



storiesOf( "Alert", module )
	.add( "Success", () => (<Alert type="success">You did it! 🥳</Alert>) )
	
	.add( "Error", () => (<Alert type="error">You did it 🥺</Alert>) )

storiesOf( "AuthenticationPage", module )
	.add( "Logging in", () =>
		makeAuthPageView( { action: "login" } ) )
	
	.add( "Signing up", () =>
		makeAuthPageView( { action: "signup" } ) )
	
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


function makeAuthPageView( props: Partial<AuthenticationPageViewProps> = {} )
{
	const safeProps: AuthenticationPageViewProps = {
		action:         "login",
		loading:        false,
		alert:          undefined,
		onAuthenticate: action( "submit" ),
		...props as any, // we enforced states, ts doesn't like mixing in Partial<props>
	}
	
	return <AuthenticationPageView {...safeProps}  />
}