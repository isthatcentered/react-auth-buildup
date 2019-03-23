import { Gatekeeper } from "./AuthenticationPage.spec"
import React from "react"
import { object } from "testdouble"




export interface ServicesContainer
{
	gatekeeper: Gatekeeper
}

export const ContainerContext = React.createContext<ServicesContainer>( {
	gatekeeper: object<Gatekeeper>(),
} )