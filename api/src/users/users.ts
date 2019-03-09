import { NextFunction, Request, RequestHandler, Response, Router } from "express"
import { db } from "./database"
import { genSalt, hash } from "bcryptjs"
import { uncover } from "redhanded"




export interface AuthCredentials
{
	email: string
	password: string
}


const createUserController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	const { email, password } = req.body,
	      users               = db.get( "users" )
	
	
	if ( incompleteCredentials() )
		return res.status( 400 )
			.json( {
				message: `Required field missing`,
			} )
			.end()
	
	
	if ( userAlreadyExists() )// @todo: if time/bored, this should go as db._ mixin .createUnique(user, "email")
		return res.status( 422 )
			.json( {
				message: `Email already taken`,
			} )
			.end()
	
	return hashPassword( password )
		.then( hashedPassword =>
			users
				.push( { email, password: hashedPassword } )
				.write() )
		.then( uncover( "AfterUserSaved" ) )
		.then( ( users: AuthCredentials[] ) =>
			res
				.status( 201 )
				.json( { email } ) )
		.catch( err =>
			res
				.status( 500 )
				.json( { error: err } ),
		)
	
	
	
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



export const hashPassword = ( password: string ): Promise<string> =>
	// Generate a salt at level 12 strength
	new Promise( ( resolve, reject ) =>
		genSalt( 12, ( err, salt ) =>
			err ?
			reject( err ) :
			hash( password, salt, ( err, hash ) =>
				err ?
				reject( err ) :
				resolve( hash ),
			),
		) )