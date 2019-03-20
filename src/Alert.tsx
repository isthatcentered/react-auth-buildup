import * as React from "react"
import { HTMLAttributes } from "react"




export type alertType = "success" | "error"

export interface AlertProps extends HTMLAttributes<HTMLDivElement>
{
	type: alertType
}


export function Alert( { style = {}, className = "", children, ...props }: AlertProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Alert`}
		>
			Alert
		</div>
	)
}