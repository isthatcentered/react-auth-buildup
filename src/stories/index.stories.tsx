import React, { HTMLAttributes } from "react";

import { storiesOf } from "@storybook/react";
import { Alert, alertKind, Button, Input, Label, LabelText, Loader } from "../Random"

import "../index.scss"

//@ts-ignore
// import { action } from "@storybook/addon-actions";
//@ts-ignore
// import { linkTo } from "@storybook/addon-links";



/*
storiesOf( "Welcome", module ).add( "to Storybook", () => <Welcome showApp={linkTo( "Button" )}/> );

storiesOf( "Button", module )
	.add( "with text", () =>
	<Button onClick={action( "clicked" )}>Hello Button</Button> )
	.add( "with some emoji", () => (
		<Button onClick={action( "clicked" )}/>
	) );
*/

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



export interface AuthenticationPageViewProps extends HTMLAttributes<HTMLDivElement>
{
	action: "login" | "signup"
	alert: { type: alertKind, message: string } | undefined
	loading: boolean
}


export function AuthenticationPageView( { loading, alert, action, style = {}, className = "", children, ...props }: AuthenticationPageViewProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPageView min-h-screen flex items-center justify-center`}
		>
			
			<div className="bg-white rounded shadow-md overflow-hidden"
			     style={{ width: 440, maxWidth: "100%" }}>
				
				{loading && <Loader width={90}/>}
				
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
		</div>
	)
}


storiesOf( "Alert", module )
	.add( "Success", () => (<Alert type="success">You did it! 🥳</Alert>) )
	
	.add( "Error", () => (<Alert type="error">You did it 🥺</Alert>) )

storiesOf( "AuthenticationPage", module )
	.add( "Logging in", () =>
		makeAuthPageView() )
	
	.add( "Signing up", () =>
		makeAuthPageView( { action: "signup" } ) )
	
	.add( "Loading", () =>
		makeAuthPageView( { loading: true } ) )
	
	.add( "Authentication error", () =>
		makeAuthPageView( {
			alert: {
				type:    "error",
				message: "Nope, not you 💩",
			},
		} ) )
	
	
	.add( "Authentication success", () =>
		makeAuthPageView( {
			alert: {
				type:    "success",
				message: "Yay, you're in! 🥳",
			},
		} ),
	)


function makeAuthPageView( props: Partial<AuthenticationPageViewProps> = {} )
{
	const _safeProps: AuthenticationPageViewProps = {
		action:  "login",
		alert:   undefined,
		loading: false,
		...props,
	}
	
	return <AuthenticationPageView {..._safeProps} />
}