import * as React from "react"
import { HTMLAttributes } from "react"
import { feature, scenario } from "jest-then";
import { appRender } from "./testUtils"
import { RouteComponentProps } from "@reach/router"




export interface AuthenticatePageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{

}


export function AuthenticatePage( { location, navigate, style = {}, className = "", children, ...props }: AuthenticatePageProps )
{
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticatePage`}
		>
			AuthenticatePage
		</div>
	)
}


feature( `User can log in`, () => {
	scenario( `Success`, () => {
		test( `Displays`, () => {
			
			const { getByText } = appRender( "/auth" )
			
			
			getByText( /AuthenticatePage/i )
		} )
		
		// sends success message
		
		// redirects after x
	} )
} )

feature( `User can sign up`, () => {

} )

feature( `Guard`, () => {

} )
