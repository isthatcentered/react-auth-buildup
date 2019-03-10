import React, { HTMLAttributes, useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import Axios from "axios"
import { ErrorAlert } from "./Random"




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
	
	useEffect( () => {
		Axios.get( `/api/quotes`, { withCredentials: true } )
			.then( ( { data } ) => setQuote( data ) )
			.catch( ( { response: { data } } ) => {
				setError( data.message )
			} )
		
	} )
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} HomePage`}
		>
			{error && <ErrorAlert>{error}</ErrorAlert>}
			{quote && (
				<blockquote className="py-2 px-4 border-l-2 ">
					<p className="text-2xl mb-2">"{quote.quote}"</p>
					<cite>{quote.author}</cite>
				</blockquote>)}
		</div>)
}