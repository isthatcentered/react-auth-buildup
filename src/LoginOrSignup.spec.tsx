import { feature, then } from "jest-then";
import { customRender } from "./AuthenticationPage.spec"
import { LoginOrSignup } from "./LoginOrSignup"
import * as React from "react"




feature( `User can switch between login & signup tabs`, () => {
	then( `It displays the correct tab`, async () => {
		const { click, getByText } = customRender( <LoginOrSignup
			onLogin={jest.fn()}
			onSignup={jest.fn()}
			message={undefined}
		/> )
		
		click( /signup/i )
		
		expect( () => getByText( /sign me up/i ) ).not.toThrow()
		
		click( /login/i )
		
		expect( () => getByText( /log me in/i ) ).not.toThrow()
	} )
} )

test( `It can display a message`, async () => {
	const { getByText } = customRender( <LoginOrSignup
		onLogin={jest.fn()}
		onSignup={jest.fn()}
		message={{ type: "success", body: "Success" }}
	/> )
	
	expect( () => getByText( /success/i ) ).not.toThrow()
} )
