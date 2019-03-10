import { Request, RequestHandler, Response, Router } from "express"
import { AuthCredentials, User, UserFactory } from "../UserModel"
import { requireFieldsGuard } from "../middlewares"
import { uncover } from "redhanded"




const authenticateUserController: RequestHandler = ( req: Request, res: Response ) => {
	
	const { email, password }: AuthCredentials = req.body,
	      user: User                           = UserFactory.from( { email, password } )
	
	uncover( "session id" )( req.session!.id )
	
	try {
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
	} catch ( { name, message } ) {
		return res
			.status( 401 )
			.json( { message, name } )
	}
}


const clearSessionController: RequestHandler = ( req, res ) => {
	if ( !req.session )
		return res.status( 200 )
	
	req.session.destroy( err => {
		if ( err ) {
			uncover( "Logout error" )( err )
			return res.status( 500 ).json( { message: "Huh, something went wrong 🤷‍♂️" } )
		}
		
		return res.status( 200 ).end()
	} )
}

export const authRouter = Router()
authRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), authenticateUserController )
	.delete( clearSessionController )


