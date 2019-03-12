import { NextFunction, Request, RequestHandler, Response, Router } from "express"




const getQuoteController: RequestHandler = ( req: Request, res: Response, next: NextFunction ) => {

	setTimeout(_ =>
	res
		.status( 201 )
		.json( { quote: `Indeed`, author: `Teal'c` } )
		, 2000  )
}


export const quotesRouter = Router()

quotesRouter
	.route( "/" )
	.get( getQuoteController )

