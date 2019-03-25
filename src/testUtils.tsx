import { fireEvent, render } from "react-testing-library"
import * as React from "react"
import { ReactElement } from "react"
import { createHistory, createMemorySource, LocationProvider, NavigateFn } from "@reach/router"
import { App } from "./App"
import { func } from "testdouble"
import { ServicesContainer, ServicesContext } from "./ServicesContext"




export function fake<T>( name: string ): T
{
	return name as any as T
}


export function aside<T>( cb: ( res: any ) => void ): ( res: T ) => T
{
	return ( res ) => {
		
		cb( res )
		
		return res
	}
}


export function tick(): Promise<undefined>
{
	return new Promise( resolve =>
		process.nextTick( () => resolve() ) )
}


export function customRender( component: ReactElement<any>, services: Partial<ServicesContainer> )
{
	const utils = render(
		<ServicesContext.Provider value={services as ServicesContainer}>
			{component}
		</ServicesContext.Provider>,
	)
	
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


export function appRender( route: string, services: Partial<ServicesContainer> )
{
	const [ path, query ] = route.split( "?" )
	
	const history = {
		...createHistory( createMemorySource( route ) ),
		navigate: func<NavigateFn>(),
	}
	
	history.location.search = query ?
	                          `?${query}` :
	                          ""
	
	const wrapper = customRender(
		<LocationProvider history={history}>
			<App/>
		</LocationProvider>, services )
	
	return {
		...wrapper,
		navigate: history.navigate,
	}
}