import { Request, RequestHandler, Response, Router } from "express"
import { User, UserFactory } from "./UserModel"
import { requireFieldsGuard } from "../middlewares"




const authenticateUserController: RequestHandler = ( req: Request, res: Response ) => {
	
	const { email, password } = req.body
	
	const user: User = UserFactory.from( { email, password } )
	
	try {
		const pass = user.authenticate( password )
		
		return res
			.status( 200 )
			.json( pass )
	} catch ( error ) {
		
		return res
			.status( 401 )
			.json( { message: "Nope, unauthorized", error } )
	}
}


export const authRouter = Router()

authRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), authenticateUserController )


