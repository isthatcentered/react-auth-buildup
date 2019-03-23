import * as React from "react"
import { HTMLAttributes } from "react"
import { Link, RouteComponentProps } from "@reach/router"




export interface HomePageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{

}


export function HomePage( { navigate, location, style = {}, className = "", children, ...props }: HomePageProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} HomePage`}
		>
			<header className="p-4 flex">
				<Link
					to="/auth"
					className="ml-auto">
					Login
				</Link>
			</header>
			<h1>Home</h1>
		</div>
	)
}