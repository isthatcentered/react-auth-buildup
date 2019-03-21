import * as React from "react"
import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react"




export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>
{

}


export function Button( { style = {}, className = "", children, ...props }: ButtonProps )
{
	
	return (
		<button
			{...props}
			style={{ ...style }}
			className={`${className} Button bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
		>
			{children}
		</button>
	)
}



export interface InputProps extends InputHTMLAttributes<HTMLInputElement>
{

}


export function Input( { style = {}, className = "", children, ...props }: InputProps )
{
	
	return (
		<input
			{...props}
			style={{ ...style }}
			className={`${className} Input shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline`}
		/>
	)
}


export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement>
{

}


export function Label( { style = {}, className = "", children, ...props }: LabelProps )
{
	
	return (
		<label
			{...props}
			style={{ ...style }}
			className={`${className} Label block text-grey-darker text-sm font-bold`}
		>
			{children}
		</label>
	)
}


export interface LabelTextProps extends HTMLAttributes<HTMLSpanElement>
{

}


export function LabelText( { style = {}, className = "", children, ...props }: LabelTextProps )
{
	
	return (
		<span
			{...props}
			style={{ ...style }}
			className={`${className} LabelText block mb-2`}
		>
			{children}
		</span>
	)
}
