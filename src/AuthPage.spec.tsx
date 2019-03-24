import * as React from "react"
import { createContext, HTMLAttributes, useContext, useEffect } from "react"

import { Case, Feature, Given, Then, When } from "jest-then"
import { appRender } from "./testUtils"
import { RouteComponentProps } from "@reach/router"
import { object, verify, when } from "testdouble"




export interface ServicesContainer
{
	gatekeeper: Gatekeeper
}

export const ServicesContext = createContext<ServicesContainer>( { gatekeeper: {} as any } )

interface Gatekeeper
{
	isAuthenticated(): boolean;
}


export interface AuthenticationPageProps extends RouteComponentProps, HTMLAttributes<HTMLDivElement>
{
}


export function AuthenticationPage( { navigate, style = {}, className = "", children, ...props }: AuthenticationPageProps )
{
	const { gatekeeper } = useContext( ServicesContext )
	
	useEffect( () => {
		if ( gatekeeper.isAuthenticated() )
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
			const gatekeeper = object<Gatekeeper>()
			when( gatekeeper.isAuthenticated() ).thenReturn( true )
			const { navigate } = appRender( "/auth", { gatekeeper } )
			
			verify( navigate( "/", undefined ) )
			
			// gatekeeper says I'm logged in
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