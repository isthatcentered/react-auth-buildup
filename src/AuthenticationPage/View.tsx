import React, { HTMLAttributes } from "react"
import { Alert, alertKind, Loader } from "../Random"
import { authenticationCredentials, AuthenticationForm } from "./AuthenticationForm"




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

type actions = {
	onAuthenticate( credentials: authenticationCredentials ): any
}
export type AuthenticationPageViewProps = immutableProps & actions & (unprocessed | processed | processing)


export function AuthenticationPageView( { onAuthenticate, loading, alert, action, style = {}, className = "", children, ...props }: AuthenticationPageViewProps & HTMLAttributes<HTMLDivElement> )
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
				
				<AuthenticationForm
					onAuthenticate={onAuthenticate}
					processing={loading || (alert && alert.type === "success") || false}
					cta={action === "login" ?
					     "Log me in" :
					     "Sign me up"}
				/>
			</div>
		</div>)
}