import * as React from "react"
import { ButtonHTMLAttributes } from "react"




export interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>
{
	active: boolean
	
	onTrigger(): any
}


export function TabButton( { active, onTrigger, style = {}, className = "", children, ...props }: TabButtonProps )
{
	const styles = active ?
	               [ "bg-white", "text-blue-darker", "border-transparent" ] :
	               [ "text-grey-darkest", "border-grey-lighter" ]
	return (
		<button
			{...props}
			style={{ ...style }}
			className={`${className} TabButton ${styles.join( " " )}`}
			onClick={onTrigger}
		>
			{children}
		</button>
	)
}
