export interface authCredentials
{
	email: string
	password: string
}

export interface Gatekeeper
{
	signup( credentials: authCredentials ): Promise<undefined>;
	
	login( credentials: authCredentials ): Promise<undefined>;
	
	authenticated(): boolean
}