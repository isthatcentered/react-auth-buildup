import { flow, given, scenario, xand } from "jest-case";
import * as React from "react"
import { FormEvent, HTMLAttributes, ReactElement, useState } from "react"
import { func, when } from "testdouble"
import { fireEvent, render } from "react-testing-library"
import { authCredentials, tick } from "./AuthenticationPage.spec"




type authenticationResponse = { type: "success", message: string } | { type: "error", message: string }

export interface AuthenticateFormProps extends HTMLAttributes<HTMLDivElement>
{
	authenticator( credentials: authCredentials ): Promise<any>
}


export function AuthenticateForm( { authenticator, style = {}, className = "", children, ...props }: AuthenticateFormProps )
{
	const [ response, setResponse ] = useState<authenticationResponse | undefined>( undefined ),
	      [ loading, setLoading ]   = useState<boolean>( false )
	
	
	function handleSubmit( e: FormEvent<HTMLFormElement> )
	{
		e.preventDefault()
		
		setLoading( true )
		
		const data     = new FormData( e.target as any ),
		      email    = data.get( "email" ) as string | null,
		      password = data.get( "password" ) as string | null
		
		if ( !email || !password )
			return
		
		authenticator( { email, password } )
			.then( () => {
				setResponse( {
					type:    "success",
					message: "success",
				} )
				
				setLoading( false )
			} )
	}
	
	
	return (
		<div
			{...props}
			style={{ ...style }}
			className={`${className} AuthenticateForm`}
		>
			{response && response.message}
			
			<form onSubmit={handleSubmit}>
				<label>
					Email:
					<input type="text"
					       name="email"
					       placeholder="Email..."/>
				</label>
				
				<label>
					Password:
					<input type="password"
					       name="password"
					       placeholder="Password..."/>
				</label>
				
				<button
					type="submit"
					disabled={loading || (response && response.type === "success")}
				>
					{loading ?
					 "loading..." :
					 "Log me in"}
				</button>
			</form>
		</div>
	)
}


describe( `<AuthenticateForm/>`, () => {
	const authenticator = func<any>(), email = "user@email.com", password = "**password**"
	
	scenario( `Auth successful`, () => {
		given( () => {
			when( authenticator( { email, password } ) ).thenResolve()
		} )
		
		flow( `Login success`, async () => {
			const { fill, submit, container } = customRender( <AuthenticateForm authenticator={authenticator}/> )
			
			
			// &todo -> login(u, p)
			fill( /email/i, email )
			
			fill( /password/i, password )
			
			submit( /password/i )
			
			// @todo: textcontent
			expect( container ).toHaveTextContent( /loading.../i )
			
			// @todo: submit button
			expect( container.querySelector( `button[type="submit"]` ) ).toHaveAttribute( "disabled" )
			
			await tick()
			
			expect( container ).toHaveTextContent( /Success/i )
			
			expect( container ).not.toHaveTextContent( /loading.../i )
			
			expect( container.querySelector( `button[type="submit"]` ) ).toHaveAttribute( "disabled" )
		} )
		
		xand( `onSuccess callback is called`, async () => {
			fail()
		} )
		
	} )
	
	scenario( `Request error`, () => {
	} )
} )



export function customRender( component: ReactElement<any> )
{
	const utils = render( component )
	
	const change = ( label: RegExp, value: any ) =>
		fireEvent.change( utils.getByLabelText( label ), { target: { value } } )
	
	const fill = ( label: RegExp, value: string ) => change( label, value )
	
	const slide = ( label: RegExp, value: number ) => change( label, value )
	
	const click = ( label: RegExp ) =>
		fireEvent.click( utils.getByText( label ) )
	
	const submit = ( label: RegExp ) =>
		fireEvent.submit( (utils.getByText( label ) as HTMLElement).closest( "form" )! )
	
	
	return {
		...utils,
		wrapper: utils.container.firstChild as HTMLElement,
		change,
		fill,
		slide,
		click,
		submit,
	}
}


function LoginController( login, router, snitch )
{
	
	snitch()
	
	redirectIfAlreadyAuthed() // -> with snitch.confirm( "Log in successful" )
	
	
	auth()
		.onSuccess( () => {
			snitch.confirm( "Log in successful" )
			return router.redirect( "/" )
		} )
		.onError( err => {
			snitch.alert( err.message )
		} ) // could be handled by login directly but this allows us to customize the message as a redirect message
	// choosing the message and success/error behavior belongs higher
	// auth() only care about "did you pass the test"
}