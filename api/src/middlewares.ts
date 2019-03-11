import { RequestHandler } from "express"
import { MissingRequiredFieldsError } from "./contracts"




export function requireFieldsGuard( ...fields: string[] ): RequestHandler
{
	
	return ( req, res, next ) => {
		
		const providedFields: string[] = Object.keys( req.body ),
		      missingFields: string[]  = fields
			      .reduce( ( notFounds: string[], field ) =>
				      providedFields.includes( field ) ?
				      notFounds :
				      [ ...notFounds, field ], [],
			      )
		
		
		if ( missingFields.length )
			throw new MissingRequiredFieldsError( missingFields )
		
		next()
	}
}


export const ensureAuthorizedMiddleware: RequestHandler = ( req, res, next ) => {
	
	if ( req.session && req.session.user && req.session.isAuthenticated ) {
		next();
	} else {
		return res.status( 403 ).json( { message: "Unauthorized" } );
	}
}