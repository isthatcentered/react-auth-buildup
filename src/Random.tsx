import React, { ButtonHTMLAttributes } from "react"




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