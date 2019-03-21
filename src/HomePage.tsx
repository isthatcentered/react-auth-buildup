import * as React from "react"
import { HTMLAttributes } from "react"
import { RouteComponentProps } from "@reach/router"




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
			HomePage
		</div>
	)
}