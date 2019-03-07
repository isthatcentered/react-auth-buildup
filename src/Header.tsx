import React, { HTMLAttributes } from "react"
import { AuthProvider } from "./App"
import { navigate } from "@reach/router"




export interface HeaderProps extends HTMLAttributes<HTMLDivElement>
{
	authProvider: AuthProvider
}


export function Header( { authProvider, style = {}, className = "", children, ...props }: HeaderProps )
{
	
	function handleLogout()
	{
		authProvider.logout()
		
		navigate( "/login" )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Header flex p-4 bg-purple`}
		>
			<div className="ml-auto">
				{!authProvider.isAuthenticated ?
				 <a href="/login">Log in</a> :
				 <button
					 onClick={handleLogout}
					 className="text-white underline"
				 >
					 Logout
				 </button>}
			</div>
		</div>
	)
}