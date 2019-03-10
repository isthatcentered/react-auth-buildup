import React, { ButtonHTMLAttributes } from "react"
import { ErrorProps } from "./LoginPage"




export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>
{

}


export function Button( { style = {}, className = "", children, ...props }: ButtonProps )
{
	
	return (
		<button
			{...props}
			style={{ ...style }}
			className={`${className} Button rounded border px-3 py-2 bg-purple text-white border-purple-dark`}
		>
			{children}
		</button>
	)
}


export function ErrorAlert( { style = {}, className = "", children, ...props }: ErrorProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Error p-4  bg-red-lightest`}
		>
			💩 {children}
		</div>
	)
}