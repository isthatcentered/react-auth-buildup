import { db } from "./database"
import { compareSync, genSaltSync, hashSync } from "bcryptjs"
import { IncorrectCredentialsError, UserAlreadyRegisteredError, UserNotRegisteredError } from "./contracts"
import { Pass } from "./Routes/sessions"




export interface AuthCredentials
{
	email: string
	password: string
}

export interface userModel extends AuthCredentials
{
}

export interface User
{
	email: string
	authenticate: ( password: string ) => void
	save: () => void
	register: () => void
}

class RegisteredUser implements User
{
	private __model: userModel
	
	
	constructor( model: userModel )
	{
		this.__model = model
	}
	
	
	get email()
	{
		return this.__model.email
	}
	
	
	register()
	{
		throw new UserAlreadyRegisteredError()
	}
	
	
	save(): User
	{
		throw new Error( `save() not implemented` )
	}
	
	
	authenticate( password: string ): void
	{
		const passwordMatching = compareSync( password, this.__model.password )
		
		if ( !passwordMatching )
			throw new IncorrectCredentialsError()
	}
}

class UnregisteredUser implements User
{
	private readonly __email: string
	private __password: string
	
	
	constructor( { email, password }: AuthCredentials )
	{
		this.__email = email
		this.__password = this.__hashPassword( password )
	}
	
	
	get email()
	{
		return this.__email
	}
	
	
	register()
	{
		this.save()
	}
	
	
	save(): User
	{
		const user: userModel = (db.get( "users" )
			.push( { email: this.__email, password: this.__password } )
			.write() as userModel[])
			.pop()!
		
		return UserFactory.from( user ) // we push so last is new
	}
	
	
	authenticate( password: string ): Pass
	{
		throw new UserNotRegisteredError()
	}
	
	
	private __hashPassword( password: string ): any
	{
		const salt = genSaltSync( 12 )
		
		return hashSync( password, salt )
	}
}

export class UserFactory
{
	static from( credentials: AuthCredentials ): User
	{
		const inDbMatch = UserFactory.find( { email: credentials.email } )
		
		return !!inDbMatch ?
		       new RegisteredUser( inDbMatch ) :
		       new UnregisteredUser( credentials )
	}
	
	
	private static find( filters: Record<string, any> ): userModel | undefined
	{
		return db.get( "users" ).find( filters ).value()
	}
}
