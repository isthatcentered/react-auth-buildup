import React, { HTMLAttributes, useContext } from "react"
import { Link } from "@reach/router"
import { AuthContext } from "./AuthContext"




export interface HeaderProps extends HTMLAttributes<HTMLDivElement>
{
}


export function Header( { style = {}, className = "", children, ...props }: HeaderProps )
{
	const context = useContext( AuthContext )
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Header flex p-4 bg-purple`}
		>
			<Link to="/">Home</Link>
			<div className="ml-auto">
				{!context.isAuthenticated ?
				 <Link to="/login">Log in</Link> :
				
				 <Link
					 to="/logout"
					 className="text-white underline"
				 >
					 Logout
				 </Link>}
			</div>
		</div>
	)
}