import React, { HTMLAttributes } from "react"
import { RouteComponentProps } from "@reach/router"




export interface HomePageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
}


export function HomePage( { style = {}, className = "", children, navigate, location, ...props }: HomePageProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} HomePage`}
		>
			'sup! 🥳
		</div>
	)
}