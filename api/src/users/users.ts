import { NextFunction, Request, RequestHandler, Response, Router } from "express"
import { db } from "./database"




const createUserController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	const { email, password } = req.body,
	      users               = db.get( "users" )
	
	if ( incompleteCredentials() )
		return res.status( 400 )
			.json( {
				message: `Required field missing`,
			} )
			.end()
	
	
	// @todo: if time/bored, this should go as db._ mixin .createUnique(user, "email")
	if ( userAlreadyExists() )
		return res.status( 422 )
			.json( {
				message: `Email already taken`,
			} )
			.end()
	
	const user = users
		.push( { email, password } )
		.write()
	
	return res
		.status( 201 )
		.json( { email } );
	
	
	function incompleteCredentials()
	{
		return !email || !password
	}
	
	
	function userAlreadyExists()
	{
		return !!users
			.find( { email } )
			.value()
	}
}

export const usersRouter = Router()

usersRouter
	.route( "/" )
	.post( createUserController )

