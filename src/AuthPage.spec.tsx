import * as React from "react"
import { HTMLAttributes, useContext, useEffect } from "react"

import { Case, Feature, Given, Then } from "jest-then"
import { appRender } from "./testUtils"
import { RouteComponentProps } from "@reach/router"
import { object, verify, when } from "testdouble"
import { ServicesContext } from "./ServicesContext"




export interface Gatekeeper
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
	const gatekeeper = object<Gatekeeper>()
	
	Case( "Already logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( true ) )
		
		Then( "User is redirected to home", () => {
			const { navigate } = appRender( "/auth", { gatekeeper } )
			
			verify( navigate( "/", undefined ) )
		} )
	} )
	
	Case( "Not logged in ", () => {
		Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
		
		Then( "User is redirected to home", () => {
			const { navigate } = appRender( "/auth", { gatekeeper } )
			
			verify( navigate( "/", undefined ), { times: 0 } )
		} )
	} )
} )

Feature( `User can log in`, () => {
	const gatekeeper = object<Gatekeeper>()
	
	Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
	
	
	Case( "Authorized", () => {
		// Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( true ) )
		
		Then( "User is redirected to home", () => {
			// const { navigate } = appRender( "/auth", { gatekeeper } )
			//
			// verify( navigate( "/", undefined ) )
		} )
	} )
	
	Case( "Not authorized", () => {
		// Given( () => when( gatekeeper.isAuthenticated() ).thenReturn( false ) )
		//
		// Then( "User gets an alert", () => {
		// 	const { navigate } = appRender( "/auth", { gatekeeper } )
		//
		// 	verify( navigate( "/", undefined ), { times: 0 } )
		// } )
		//
		// And( "User is not redirected", () => {
		//
		// } )
	} )
} )

// I can login
// I get redirected to home
