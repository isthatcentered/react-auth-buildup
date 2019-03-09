import { Request, RequestHandler, Response, Router } from "express"
import { User } from "./UserModel"
import { requireFieldsGuard } from "../middlewares"




const authenticateUserController: RequestHandler = ( req: Request, res: Response ) => {
	
	const { email, password } = req.body
	
	return User.logIn( { email, password } )
		.then( auth =>
			res
				.status( 200 )
				.json( auth ) )
		.catch( () =>
			res
				.status( 401 )
				.json( { message: "Nope, unauthorized" } ) )
}


export const authRouter = Router()

authRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), authenticateUserController )


