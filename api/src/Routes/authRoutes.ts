import { Request, RequestHandler, Response, Router } from "express"
import { AuthCredentials, User, UserFactory } from "../UserModel"
import { requireFieldsGuard } from "../middlewares"




const authenticateUserController: RequestHandler = ( req: Request, res: Response ) => {
	
	const { email, password }: AuthCredentials = req.body,
	      user: User                           = UserFactory.from( { email, password } )
	
	try {
		const pass = user.authenticate( password )
		
		return res
			.status( 200 )
			.json( pass )
	} catch ( { name, message } ) {
		return res
			.status( 401 )
			.json( { error: { message, name } } )
	}
}


export const authRouter = Router()

authRouter
	.route( "/" )
	.post( requireFieldsGuard( "email", "password" ), authenticateUserController )


