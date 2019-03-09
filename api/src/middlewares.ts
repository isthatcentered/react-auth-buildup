import { RequestHandler } from "express"




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
			return res.status( 400 )
				.json( {
					message: `Required fields ${missingFields.map( f => `"${f}"` ).join( ", " )} missing 😭`,
				} )
		
		next()
	}
}