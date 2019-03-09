import { NextFunction, Request, RequestHandler, Response, Router } from "express"
import { db } from "./database"
import { compare, genSalt, hash } from "bcryptjs"
import { uncover } from "redhanded"
import { AuthCredentials } from "./users"




const authenticateUserController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	const { email, password } = req.body,
	      users               = db.get( "users" )
	
	
	if ( incompleteCredentials() )
		return res.status( 400 )
			.json( {
				message: `Required field missing`,
			} )
			.end()
	
	
	const match: AuthCredentials | undefined = users.find( { email } ).value()
	
	if ( !match )
		return res.status( 404 )
			.json( {
				message: `No user with this email`,
			} )
			.end()
	
	
	authenticate( { email, password }, match )
		.then( credentialsOk =>
			credentialsOk ?
			res
				.status( 200 )
				.json( { email, token: "qdfsqjmhqs" } ) :
			res
				.status( 401 )
				.json( { message: "Nope, unauthorized" } ),
		)
		.catch( err => {
			uncover( "compare catch" )( err )
			
			return res
				.status( 500 )
				.json( { message: "Something went wrong, no clue what 🤷‍♂️" } )
		} )
	
	
	
	function authenticate( attempt: AuthCredentials, expected: AuthCredentials ): Promise<boolean>
	{
		return passwordIsCorrect( attempt.password, expected.password )
	}
	
	
	function passwordIsCorrect( attempt: string, hashed: string ): Promise<boolean>
	{
		return compare( attempt, hashed )
			.then( uncover( "password matches ?" ) )
			.catch( ( err: string ) => {
				// uncover( "Failed password" )( err )
				return false
			} )
		
	}
	
	
	function incompleteCredentials(): boolean
	{
		return !email || !password
	}
}


export const authRouter = Router()

authRouter
	.route( "/" )
	.post( authenticateUserController )



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