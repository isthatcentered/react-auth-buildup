import * as React from "react"
import { customRender } from "./AuthenticationPage.spec"
import { TabButton, TabPanel } from "./Tab"
import { func, matchers, verify } from "testdouble"




describe( `<TabPanel/>`, () => {
	test( `Displays children if active`, () => {
		const { container } = customRender(
			<TabPanel active={true}>
				<h1>I WILL BE RENDERED</h1>
			</TabPanel> )
		
		expect( container.childElementCount ).toBe( 1 )
	} )
	
	test( `Doesn't display if inactive`, () => {
		const { container } = customRender(
			<TabPanel active={false}>
				<h1>I WON'T BE RENDERED LOLZ</h1>
			</TabPanel> )
		
		expect( container.childElementCount ).toBe( 0 )
	} )
} )

describe( `<TabButton/>`, () => {
	test( `Calls the onClick prop on click`, () => {
		const { click, clickSpy } = renderTabButton()
		
		click()
		
		verify( clickSpy( matchers.anything() ), { times: 1 } )
	} )
	
	test( `Displays the correct styles when active`, () => {
		const { element } = renderTabButton( { active: true } )
		
		expect( element ).toHaveClass( "bg-white", "text-blue-darker", "border-transparent" )
	} )
	
	test( `Displays the correct styles when inactive`, () => {
		const { element } = renderTabButton( { active: false } )
		
		expect( element ).toHaveClass( "text-grey-darkest", "border-grey-lighter" )
	} )
	
	
	function renderTabButton( { active }: { active: boolean } = { active: false } )
	{
		const clickSpy = func<any>()
		
		const wrapper = customRender(
			<TabButton
				onTrigger={clickSpy}
				active={active}>
				Click me
			</TabButton> )
		
		const element = wrapper.container.getElementsByTagName( "button" )[ 0 ]
		
		const click = () => wrapper.click( /click me/i )
		
		return {
			element,
			clickSpy,
			click,
		}
	}
} )


