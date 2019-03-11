import { NextFunction, Request, RequestHandler, Response, Router } from "express"
import { AuthCredentials, User, UserFactory } from "../UserModel"
import { requireFieldsGuard } from "../middlewares"




const createUserController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	const { email, password }: AuthCredentials = req.body,
	      user: User                           = UserFactory.from( { email, password } )
	
	user.register()
	
	return res
		.status( 201 )
		.json( { email } )
}


export const usersRouter = Router()

usersRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), createUserController )
