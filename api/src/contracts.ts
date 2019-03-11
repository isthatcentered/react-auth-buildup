export class ErrorResponse
{
	type: string
	message: string
	
	
	constructor( { message, type }: { message: string, type: string } )
	{
		this.type = type
		this.message = message
	}
}