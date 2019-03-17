import * as React from "react"
import { HTMLAttributes } from "react"

export interface AppProps extends HTMLAttributes<HTMLDivElement>{

}

export function App({style= {}, className = "", children,...props}:AppProps)  {

	return (
		<div
			{...props}
			style={{...style}}
			className={`${className} App`}
		>
			App
		</div>
	)
}


