export class UserAlreadyRegisteredError extends Error
{
	constructor()
	{
		const _message = `An account with this email already exists`
		super( _message )
		this.name = "UserAlreadyRegisteredError"
		this.message = _message
	}
}

export class IncorrectCredentialsError extends Error
{
	constructor()
	{
		const _message = `Something is wrong with your username or password (or both 😅️)`
		super( _message )
		this.name = "IncorrectCredentialsError"
		this.message = _message
	}
}

export class UserNotRegisteredError extends Error
{
	constructor()
	{
		const _message = `No matching account found`
		super( _message )
		this.name = "UserNotRegisteredError"
		this.message = _message
	}
}

export class MissingRequiredFieldsError extends Error
{
	constructor()
	{
		const _message = `Missing required fields`
		super( _message )
		this.name = "MissingRequiredFieldsError"
		this.message = _message
	}
}