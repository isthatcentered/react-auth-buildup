import { fireEvent, render, RenderResult } from "react-testing-library"
import * as React from "react"
import { ReactElement } from "react"
import { createHistory, createMemorySource, LocationProvider, NavigateFn } from "@reach/router"
import { App } from "./App"
import { func, TestDouble } from "testdouble"
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


interface customRenderResults extends RenderResult
{
	fill( label: RegExp, value: any ): void
	
	change( label: RegExp, value: any ): void
	
	slide( label: RegExp, value: any ): void
	
	fill( label: RegExp, value: any ): void
	
	click( label: RegExp ): void
	
	submit( label: RegExp ): void
	
	wrapper: HTMLElement
}


export function customRender( component: ReactElement<any>, services: Partial<ServicesContainer> ): customRenderResults
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


export interface appRender extends customRenderResults
{
	navigate: TestDouble<NavigateFn>,
}


export function appRender( route: string, services: Partial<ServicesContainer> ): appRender
{
	const history = {
		...createHistory( createMemorySource( route ) ),
		navigate: func<NavigateFn>(),
	}
	
	const wrapper = customRender(
		<LocationProvider history={history}>
			<App/>
		</LocationProvider>, services )
	
	return {
		...wrapper,
		navigate: history.navigate,
	}
}