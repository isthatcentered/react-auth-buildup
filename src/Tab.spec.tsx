import * as React from "react"
import { customRender } from "./AuthenticationPage.spec"
import { TabButton } from "./Tab"
import { func, matchers, verify } from "testdouble"




describe( `<TabButton/>`, () => {
	test( `Calls the onClick prop on click`, () => {
		const onClick   = func<any>(),
		      { click } = customRender(
			      <TabButton
				      onTrigger={onClick}
				      active={false}>Click me
			      </TabButton> )
		
		click( /click me/i )
		
		verify( onClick( matchers.anything() ), { times: 1 } )
	} )
	
	test( `Displays the correct styles when active`, () => {
		const { container } = customRender(
			<TabButton
				onTrigger={jest.fn()}
				active={true}>Click me
			</TabButton> ),
		      component     = container.getElementsByTagName( "button" )[ 0 ]
		
		
		expect( component ).toHaveClass( "bg-white", "text-blue-darker", "border-transparent" )
	} )
	
	test( `Displays the correct styles when inactive`, () => {
		const { container } = customRender(
			<TabButton
				onTrigger={jest.fn()}
				active={false}>Click me
			</TabButton> ),
		      component     = container.getElementsByTagName( "button" )[ 0 ]
		
		
		expect( component ).toHaveClass( "text-grey-darkest", "border-grey-lighter" )
	} )
} )