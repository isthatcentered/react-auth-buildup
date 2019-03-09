import { db } from "./database"
import { compare } from "bcryptjs"
import { AuthCredentials } from "./users"




export class User
{
	static logIn( { email, password }: AuthCredentials ): Promise<{ email: string, token: string }>
	{
		const match: AuthCredentials | undefined = db.get( "users" ).find( { email } ).value()
		
		if ( !match )
			return Promise.reject( new Error( `No matching user matching email "${email}" found` ) )
		
		return compare( password, match.password )
			.then( passwordIsOk => {
				
				if ( !passwordIsOk )
					throw new Error( `Unothorized` )
				
				return {
					email,
					token: "ljhkgjfhdgshgfhgjkhlhmj",
				}
			} )
	}
}