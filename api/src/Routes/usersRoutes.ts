import { NextFunction, Request, RequestHandler, Response, Router } from "express"
import { AuthCredentials, User, UserFactory } from "../UserModel"
import { requireFieldsGuard } from "../middlewares"
import { ErrorResponse } from "../contracts"




const createUserController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	const { email, password }: AuthCredentials = req.body,
	      user: User                           = UserFactory.from( { email, password } )
	
	try {
		user.register()
		
		return res
			.status( 201 )
			.json( { email } )
	} catch ( { name, message } ) {
		return res
			.status( 422 )
			.json( new ErrorResponse( { type: name, message } ) )
	}
}


export const usersRouter = Router()

usersRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), createUserController )
