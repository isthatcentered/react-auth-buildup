import React, { HTMLAttributes, useContext, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { RouteComponentProps } from "@reach/router"




export interface LogoutPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{

}


export function LogoutPage( { navigate, location, style = {}, className = "", children, ...props }: LogoutPageProps )
{
	// call destroy session
	
	// navigate to home
	const authProvider = useContext( AuthContext )
	
	useEffect( () => {
		authProvider.logout()
			.then( () => {
				navigate!( "/login" )
			} )
	} )
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} LogoutPage`}
		>
			Logging out... 👨‍🚀
		</div>
	)
}