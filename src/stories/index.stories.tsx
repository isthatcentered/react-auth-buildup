import React, { HTMLAttributes } from "react";

import { storiesOf } from "@storybook/react";
import { Alert, alertKind, Button, Input, Label, LabelText, Loader } from "../Random"

import "../index.scss"

//@ts-ignore
// import { action } from "@storybook/addon-actions";
//@ts-ignore
// import { linkTo } from "@storybook/addon-links";


export interface TabButtonProps extends HTMLAttributes<HTMLDivElement>
{
	active: boolean
}


export function TabButton( { active, style = {}, className = "", children, ...props }: TabButtonProps )
{
	
	const styles = active ?
	               [ "font-bold" ] :
	               [ "border", "border-grey-lighter", "bg-grey-lightest" ]
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} TabButton`}
		>
			<button className={`p-4 w-full text-grey-darker ${styles.join( " " )}`}>
				{children}
			</button>
		</div>
	)
}


type immutableProps = {
	action: "login" | "signup",
}

type unprocessed = {
	loading: false
	alert: undefined
}

type processed = {
	loading: false
	alert: { type: alertKind, message: string } // You always get a feedback, success or error
}

type processing = {
	loading: true,
	alert: undefined | { type: alertKind, message: string } // might be re-submitting after a form erro
}

export type AuthenticationPageViewProps = immutableProps & (unprocessed | processed | processing)


export function AuthenticationPageView( { loading, alert, action, style = {}, className = "", children, ...props }: AuthenticationPageViewProps & HTMLAttributes<HTMLDivElement> )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPageView min-h-screen flex items-center justify-center`}
		>
			
			<div className="bg-white rounded shadow-md overflow-hidden"
			     style={{ width: 440, maxWidth: "100%" }}>
				
				{loading && <Loader msDuration={8000}/>}
				
				<nav>
					<ul className="list-reset flex justify-center text-center">
						<li className="flex-grow">
							<TabButton active={action === "login"}>
								Login
							</TabButton>
						</li>
						<li className="flex-grow">
							<TabButton active={action === "signup"}>
								Signup
							</TabButton>
						</li>
					</ul>
				</nav>
				
				{alert && (
					<Alert type={alert.type}
					       className="mx-8 mt-8 -mb-2">
						{alert.message}
					</Alert>)}
				
				<form className="p-8">
					<Label className="mb-8">
						<LabelText className="mb-4">Email</LabelText>
						<Input name="email"
						       type="email"/>
					</Label>
					
					<Label className="mb-8">
						<LabelText className="mb-4">Password</LabelText>
						<Input name="password"
						       type="password"/>
					</Label>
					
					<Button disabled={loading || (alert && alert.type === "success")}>
						{action === "login" ?
						 "Log me in" :
						 "Sign me up"}
					</Button>
				</form>
			</div>
		</div>)
}



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
		action:  "login",
		loading: false,
		alert:   undefined,
		...props as any, // we enforced states, ts doesn't like mixing in Partial<props>
	}
	
	return <AuthenticationPageView {...safeProps}  />
}