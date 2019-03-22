import * as React from "react"
import { ButtonHTMLAttributes } from "react"




export interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>
{
	active: boolean
	
	onTrigger(): any
}


export function TabButton( { active, onTrigger, style = {}, className = "", children, ...props }: TabButtonProps )
{
	
	const activeStyles: string[]   = [ "bg-white", "text-blue-darker", "border-transparent" ],
	      inactiveStyles: string[] = [ "text-grey-darkest", "border-grey-lighter" ]
	
	const styles = active ?
	               activeStyles :
	               inactiveStyles
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
