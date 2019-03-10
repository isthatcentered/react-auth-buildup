import { NextFunction, Request, RequestHandler, Response, Router } from "express"




const getQuoteController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {
	
	return res
		.status( 201 )
		.json( { quote: `Indeed`, author: `Teal'c` } )
}


export const quotesRouter = Router()

quotesRouter
	.route( "/" )
	.get( getQuoteController )

