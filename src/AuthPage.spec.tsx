import * as React from "react"
import { createContext, HTMLAttributes, useContext, useEffect } from "react"

import { Case, Feature, Given, Then, When } from "jest-then"
import { appRender } from "./testUtils"
import { RouteComponentProps } from "@reach/router"
import { verify } from "testdouble"




export const ServicesContext = createContext<{ gateway: Gateway }>( { gateway: {} as any } )

interface Gateway
{
}


export interface AuthenticationPageProps extends RouteComponentProps, HTMLAttributes<HTMLDivElement>
{
}


export function AuthenticationPage( { navigate, style = {}, className = "", children, ...props }: AuthenticationPageProps )
{
	const { gateway } = useContext( ServicesContext )
	
	useEffect( () => {
		navigate!( "/" )
	} )
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticationPage`}
		>
			AuthenticationPage
		</div>
	)
}


Feature( `User is redirected to home if already logged in`, () => {
	Case( "Already logged in ", () => {
		Given( () => {
		} )
		
		When( () => {
		} )
		
		Then( "", () => {
			const { navigate } = appRender( "/auth" )
			
			verify( navigate( "/", undefined ) )
			
			// gateway says I'm logged in
			// I try to access the page
			// I am redirected
		} )
	} )
	
	Case( "Not logged in ", () => {
	
	} )
	// I get redirected to home if already authed
	
	test( ``, () => {
	
	} )
	
	// I can signup
	// I get redirected to home success redirects to home
	
	
	// I can login
	// I get redirected to home
	
} )