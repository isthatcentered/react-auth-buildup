import { createContext } from "react"
import { Gatekeeper } from "./AuthPage.spec"




export interface ServicesContainer
{
	gatekeeper: Gatekeeper
}

export const ServicesContext = createContext<ServicesContainer>( { gatekeeper: {} as any } )
