import * as React from "react"
import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react"




export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>
{

}


export function Button( { style = {}, className = "", children, ...props }: ButtonProps )
{
	const styles = props.disabled ?
	               [ "bg-grey-light border-transparent" ] :
	               [ "bg-purple hover:bg-purple-dark text-white border-purple-dark" ]
	return (
		<button
			{...props}
			style={{ ...style }}
			className={`${className} Button font-bold px-4 border py-3 rounded focus:outline-none focus:shadow-outline ${styles.join( " " )}`}
		>
			{children}
		</button>
	)
}





export type alertKind = "success" | "error"

export interface AlertProps extends HTMLAttributes<HTMLDivElement>
{
	type: alertKind
	children: any
}


export function Alert( { type, style = {}, className = "", children, ...props }: AlertProps )
{
	const styles: { [p in alertKind]: string } = {
		      error:   "red",
		      success: "green",
	      },
	      color: string                        = styles[ type ]
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} Alert border p-4 rounded relative bg-${color}-lightest border-${color}-lighter text-${color}-dark`}
			role="alert"
		>
			{children}
		</div>
	)
}


export interface LoaderProps extends HTMLAttributes<HTMLDivElement>
{
	msDuration: number
}


export function Loader( { msDuration, style = {}, className = "", children, ...props }: LoaderProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style, height: 4 }}
			className={`${className} Loader w-full bg-purple-lightest animation-grow`}
		>
			<div
				className="h-full w-1/2 bg-purple animation-fill-width"
				style={{ width: 0, animationDuration: `${msDuration}ms` }}
			/>
		</div>
	)
}
