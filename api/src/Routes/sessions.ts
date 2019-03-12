import { Request, RequestHandler, Response, Router } from "express"
import { AuthCredentials, User, UserFactory } from "../UserModel"
import { requireFieldsGuard } from "../middlewares"
import { SomethingWentWrongError } from "../contracts"
import jwt from "jsonwebtoken"




const createSession: RequestHandler = ( req: Request, res: Response ) => {
	
	const { email, password }: AuthCredentials = req.body,
	      user: User                           = UserFactory.from( { email, password } )
	
	user.authenticate( password )
	
	const pass: Pass = createPass( user )
	
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



function createPass( user: User ): Pass
{
	const claim  = {
		      "https://oauthplayground.com/id":    user.email,
		      "https://oauthplayground.com/email": user.email,
	      },
	      config = {
		      algorithm: "HS256",
		      expiresIn: "1h",
	      }
	
	const token = jwt.sign(
		claim,
		process.env.JWT_SECRET!,
		config,
	)
	
	return {
		token,
	}
}


export interface Pass
{
	token: string
}