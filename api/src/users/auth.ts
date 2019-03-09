import { NextFunction, Request, RequestHandler, Response, Router } from "express"
import { db } from "./database"
import { User } from "./UserModel"




const authenticateUserController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	const { email, password } = req.body,
	      users               = db.get( "users" )
	
	
	if ( incompleteCredentials() )
		return res.status( 400 )
			.json( {
				message: `Required field missing`,
			} )
			.end()
	
	
	return User.logIn( { email, password } )
		.then( auth =>
			res
				.status( 200 )
				.json( auth ) )
		.catch( () =>
			res
				.status( 401 )
				.json( { message: "Nope, unauthorized" } ) )
	
	
	function incompleteCredentials(): boolean
	{
		return !email || !password
	}
}


export const authRouter = Router()

authRouter
	.route( "/" )
	.post( authenticateUserController )


