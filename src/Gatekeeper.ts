export interface authCredentials
{
	email: string
	password: string
}

export interface Gatekeeper
{
	signup( credentials: authCredentials ): Promise<void>;
	
	login( credentials: authCredentials ): Promise<void>;
	
	authenticated(): boolean
}