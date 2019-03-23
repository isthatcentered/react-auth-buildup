import { Gatekeeper } from "./AuthenticationPage"
import React from "react"
import { object } from "testdouble"




export interface ServicesContainer
{
	gatekeeper: Gatekeeper
}

export const ContainerContext = React.createContext<ServicesContainer>( {
	gatekeeper: object<Gatekeeper>(),
} )