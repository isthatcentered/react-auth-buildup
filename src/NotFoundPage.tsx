import React, { HTMLAttributes } from "react"
import { RouteComponentProps } from "@reach/router"




export interface NotFoundPageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{

}


export function NotFoundPage( { navigate, location, style = {}, className = "", children, ...props }: NotFoundPageProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} NotFoundPage`}
		>
			<h1 style={{ fontSize: "120px" }}>🤷‍♂️</h1>
			(page not found)
		</div>
	)
}