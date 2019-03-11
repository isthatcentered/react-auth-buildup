import { db } from "./database"
import { compareSync, genSaltSync, hashSync } from "bcryptjs"
import { IncorrectCredentialsError, UserAlreadyRegisteredError, UserNotRegisteredError } from "./contracts"
import jwt from "jsonwebtoken"




export interface AuthCredentials
{
	email: string
	password: string
}

export interface Pass
{
	token: string
}

export interface userModel extends AuthCredentials
{
}

export interface User
{
	authenticate: ( password: string ) => Pass
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
	
	
	register()
	{
		throw new UserAlreadyRegisteredError()
	}
	
	
	save(): User
	{
		throw new Error( `save() not implemented` )
	}
	
	
	authenticate( password: string ): Pass
	{
		const passwordMatching = compareSync( password, this.__model.password )
		
		if ( !passwordMatching )
			throw new IncorrectCredentialsError()
		
		return {
			token: this.__createPass(),
		}
	}
	
	
	private __createPass(): string
	{
		const claim  = {
			      "https://oauthplayground.com/id":    this.__model.email,
			      "https://oauthplayground.com/email": this.__model.email,
		      },
		      config = {
			      algorithm: "HS256",
			      expiresIn: "1h",
		      }
		
		return jwt.sign(
			claim,
			process.env.JWT_SECRET!,
			config,
		)
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
