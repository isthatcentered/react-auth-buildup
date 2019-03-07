import React, { HTMLAttributes, useContext } from "react"
import { Link, navigate } from "@reach/router"
import { AuthContext } from "./AuthContext"




export interface HeaderProps extends HTMLAttributes<HTMLDivElement>
{
}


export function Header( { style = {}, className = "", children, ...props }: HeaderProps )
{
	const context = useContext( AuthContext )
	
	
	function handleLogout()
	{
		context.logout()
		
		navigate( "/login" )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Header flex p-4 bg-purple`}
		>
			<div className="ml-auto">
				{!context.isAuthenticated ?
				 <Link to="/login">Log in</Link> :
				
				 <button
					 onClick={handleLogout}
					 className="text-white underline"
				 >
					 Logout
				 </button>
				}
			
			</div>
		</div>
	)
}