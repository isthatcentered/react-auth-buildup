import { Request, RequestHandler, Response, Router } from "express"
import { AuthCredentials, User, UserFactory } from "../UserModel"
import { requireFieldsGuard } from "../middlewares"
import { SomethingWentWrongError } from "../contracts"




const createSession: RequestHandler = ( req: Request, res: Response ) => {
	
	const { email, password }: AuthCredentials = req.body,
	      user: User                           = UserFactory.from( { email, password } )
	
	const pass = user.authenticate( password )
	
	if ( req.session ) {
		req.session.user = {
			email: email,
		};
		
		req.session.isAuthenticated = true;
	}
	
	return res
		.status( 200 )
		.json( pass )
}


const clearSessionController: RequestHandler = ( req, res ) => {
	
	if ( !req.session )
		return res.status( 200 )
	
	req.session.destroy( err => {
		if ( err )
			throw new SomethingWentWrongError()
		
		return res.status( 200 ).end()
	} )
}

export const authRouter = Router()
authRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), createSession )
	.delete( clearSessionController )


