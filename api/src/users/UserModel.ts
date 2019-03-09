import { db } from "./database"
import { compare } from "bcryptjs"
import { AuthCredentials } from "./users"
import { uncover } from "redhanded"




export class User
{
	static logIn( { email, password }: AuthCredentials ): Promise<{ email: string, token: string }>
	{
		
		return User.find( { email } )
			.then( uncover( "MATCH" ) )
			.then( match =>
				compare( password, match.password ) )
			.then( passwordIsOk => {
				if ( !passwordIsOk )
					throw new Error( `Unauthorized` )
				
				return {
					email,
					token: "ljhkgjfhdgshgfhgjkhlhmj",
				}
			} )
	}
	
	
	static find( filters: { [ key: string ]: any } ): Promise<AuthCredentials>
	{
		return new Promise( ( resolve, reject ) => {
			
			const match: AuthCredentials | undefined = db.get( "users" ).find( filters ).value()
			
			uncover( "MATCH?" )( match )
			if ( !match )
				reject( { message: `No user matching filters ${Object.keys( filters )} found` } )
			
			resolve( match )
		} )
	}
}