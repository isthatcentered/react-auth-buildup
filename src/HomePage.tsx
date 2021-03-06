import React, { HTMLAttributes, useContext, useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import { ErrorAlert } from "./Random"
import { API } from "./api"
import { ApiError } from "../api/src/contracts"
import { AuthContext } from "./AuthContext"
import { useProtectedRoute } from "./App"




export interface HomePageProps extends HTMLAttributes<HTMLDivElement>, RouteComponentProps
{
}


interface quote
{
	quote: string
	author: string
}


export function HomePage( { style = {}, className = "", children, navigate, location, ...props }: HomePageProps )
{
	
	const [ quote, setQuote ] = useState<quote | undefined>( undefined ),
	      [ error, setError ] = useState( "" )
	
	const authProvider = useContext( AuthContext )
	
	useProtectedRoute()
	
	useEffect( () => {
		API.get( `/quotes`, {
				headers: {
					...authProvider.getAuthHeader(),
				},
			} )
			.then( ( { data } ) => setQuote( data ) )
			.catch( ( { response: { data } } ) => {
				setError( (data as ApiError).message )
			} )
		
	} )
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} HomePage`}
		>
			Hello 🥳
			{error && <ErrorAlert>{error}</ErrorAlert>}
			{quote && (
				<blockquote className="py-2 px-4 border-l-2 ">
					<p className="text-2xl mb-2">"{quote.quote}"</p>
					<cite>{quote.author}</cite>
				</blockquote>)}
		</div>)
}