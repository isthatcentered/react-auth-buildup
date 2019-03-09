import { NextFunction, Request, RequestHandler, Response, Router } from "express"
import { User, UserFactory } from "./UserModel"
import { requireFieldsGuard } from "../middlewares"




const createUserController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	const { email, password } = req.body
	
	const user: User = UserFactory.from( { email, password } )
	
	if ( user.registered() )
		return res.status( 422 )
			.json( {
				message: `Email already taken`,
			} )
			.end()
	
	try {
		user.save()
		
		return res
			.status( 201 )
			.json( { email } )
	} catch ( error ) {
		return res
			.status( 500 )
			.json( { error } )
	}
}


export const usersRouter = Router()

usersRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), createUserController )
