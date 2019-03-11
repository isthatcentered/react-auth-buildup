export interface ApiError extends Error
{
	status: number
}

export class UserAlreadyRegisteredError extends Error implements ApiError
{
	status = 422
	name = "UserAlreadyRegisteredError"
	message = `An account with this email already exists`
}

export class IncorrectCredentialsError extends Error implements ApiError
{
	status = 401
	name = "IncorrectCredentialsError"
	message = `Something is wrong with your username or password (or both 😅️)`
}

export class UserNotRegisteredError extends Error implements ApiError
{
	status = 401
	name = "UserNotRegisteredError"
	message = `No matching account found`
}

export class MissingRequiredFieldsError extends Error implements ApiError
{
	constructor( fields: string[] )
	{
		super()
		
		this.message = `Missing required ${fields.map( f => `"${f}` ).join( ", " )}" fields`
	}
	
	
	status = 400
	name = "MissingRequiredFieldsError"
}

export class SomethingWentWrongError extends Error implements ApiError
{
	status = 500
	name = "Server error"
	message = "Huh, something went wrong 🤷‍♂️"
}