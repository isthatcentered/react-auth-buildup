import { db } from "./database"
import { compareSync, genSaltSync, hashSync } from "bcryptjs"




export interface AuthCredentials
{
	email: string
	password: string
}

interface Pass
{
	token: string
}

export interface User
{
	authenticate: ( password: string ) => Pass
	registered: () => boolean
	save: () => void
}

export class UserFactory
{
	static from( credentials: AuthCredentials )
	{
		const inDbMatch: userModel = db.get( "users" ).find( { email: credentials.email } ).value()
		
		if ( !!inDbMatch )
			return new RegisteredUser( inDbMatch )
		
		return new UnregisteredUser( credentials )
	}
}

interface userModel
{
	email: string
	password: string
}

class RegisteredUser implements User
{
	private __model: userModel
	
	
	constructor( model: userModel )
	{
		this.__model = model
	}
	
	
	registered()
	{
		return true
	}
	
	
	save(): User
	{
		throw new Error( `save() not implemented` )
	}
	
	
	authenticate( password: string ): Pass
	{
		const passwordMatching = compareSync( password, this.__model.password )
		
		if ( !passwordMatching )
			throw new Error( `Incorrect redentials` )
		
		return {
			token: Math.random().toString(),
		}
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
	
	
	registered()
	{
		return false
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
		throw new Error( `User "${this.__email}" has not been saved yet` )
	}
	
	
	private __hashPassword( password: string ): any
	{
		const salt = genSaltSync( 12 )
		
		return hashSync( password, salt )
	}
}
